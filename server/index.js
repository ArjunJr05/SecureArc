// server/index.js - Express Server for SecureArch Platform
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { referenceDataset } from "./mock-data.js";
import { awsManager } from "./aws-client.js";
import { RemediationEngine } from "./remediation.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory application state initialized with reference dataset
let currentState = JSON.parse(JSON.stringify(referenceDataset));
let remediationEngine = new RemediationEngine(currentState);

// Check if initial .env has AWS keys and attempt auto-test
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsManager.testConnection({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN || "",
    region: process.env.AWS_DEFAULT_REGION || "ap-south-1"
  }).then(res => {
    if (res.success) {
      console.log("Connected to Live AWS:", res.details.arn);
    } else {
      console.log("AWS Credentials detected but connection failed:", res.error);
    }
  });
}

// ======================== API ROUTES ========================

// 1. Connection & Platform Status
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    isLiveAws: awsManager.isConnected,
    region: awsManager.credentials.region || currentState.accountInfo.selectedRegion,
    account: awsManager.connectionDetails || currentState.accountInfo,
    connectionError: awsManager.connectionError,
    lastChecked: awsManager.lastChecked,
    mode: awsManager.isConnected ? "LIVE_AWS" : "REFERENCE_MODE"
  });
});

// 2. Overview Data (Matches Figure 4.4.6)
app.get("/api/overview", (req, res) => {
  res.json({
    accountInfo: awsManager.isConnected
      ? { ...currentState.accountInfo, ...awsManager.connectionDetails }
      : currentState.accountInfo,
    metrics: currentState.overviewMetrics,
    recentAuditActivity: currentState.recentAuditActivity.slice(0, 10),
    recentFindings: currentState.recentFindings.slice(0, 10),
    isLiveAws: awsManager.isConnected
  });
});

// 3. Risk Findings & Detailed Register
app.get("/api/findings", (req, res) => {
  const { severity, service, status, search } = req.query;
  let findings = [...currentState.recentFindings];

  if (severity && severity !== "all") {
    findings = findings.filter(f => f.severity.toLowerCase() === severity.toLowerCase());
  }
  if (service && service !== "all") {
    findings = findings.filter(f => f.service.toLowerCase() === service.toLowerCase());
  }
  if (status && status !== "all") {
    findings = findings.filter(f => f.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    findings = findings.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.resource.toLowerCase().includes(q)
    );
  }

  res.json({
    total: findings.length,
    findings,
    summary: currentState.overviewMetrics.findingsBySeverity
  });
});

// 4. Documented Risk Register (Section 4.4.1 Step 3)
app.get("/api/risk-register", (req, res) => {
  res.json({
    risks: currentState.riskRegister,
    total: currentState.riskRegister.length
  });
});

// 5. Module 1: IAM & Access Control
app.get("/api/iam", async (req, res) => {
  let liveData = null;
  if (awsManager.isConnected) {
    liveData = await awsManager.fetchLiveSecurityData();
  }

  res.json({
    details: currentState.iamDetails,
    liveAwsData: liveData ? liveData.services.iam : null,
    isLiveAws: awsManager.isConnected
  });
});

// 6. Module 2: Network Security
app.get("/api/network", async (req, res) => {
  let liveData = null;
  if (awsManager.isConnected) {
    liveData = await awsManager.fetchLiveSecurityData();
  }

  res.json({
    details: currentState.networkDetails,
    liveAwsData: liveData ? liveData.services.network : null,
    isLiveAws: awsManager.isConnected
  });
});

// 7. Module 3: Data Protection & KMS
app.get("/api/data-protection", async (req, res) => {
  let liveData = null;
  if (awsManager.isConnected) {
    liveData = await awsManager.fetchLiveSecurityData();
  }

  res.json({
    details: currentState.dataProtectionDetails,
    liveAwsData: liveData ? { s3: liveData.services.s3, kms: liveData.services.kms } : null,
    isLiveAws: awsManager.isConnected
  });
});

// 8. Module 4: Audit Logs & CloudTrail
app.get("/api/audit-logs", async (req, res) => {
  let liveData = null;
  if (awsManager.isConnected) {
    liveData = await awsManager.fetchLiveSecurityData();
  }

  res.json({
    cloudTrail: currentState.complianceDetails.cloudTrail,
    alarms: currentState.complianceDetails.cloudWatchAlarms,
    recentEvents: currentState.recentAuditActivity,
    liveAwsEvents: liveData ? liveData.services.cloudtrail : null,
    isLiveAws: awsManager.isConnected
  });
});

// 9. Module 4: Compliance & AWS Config Rules
app.get("/api/compliance", async (req, res) => {
  let liveData = null;
  if (awsManager.isConnected) {
    liveData = await awsManager.fetchLiveSecurityData();
  }

  res.json({
    config: currentState.complianceDetails.awsConfig,
    complianceRate: currentState.overviewMetrics.complianceRate,
    complianceOverTime: currentState.overviewMetrics.complianceOverTime,
    liveAwsConfig: liveData ? liveData.services.config : null,
    isLiveAws: awsManager.isConnected
  });
});

// 10. Remediation Runbooks & History
app.get("/api/remediation", (req, res) => {
  res.json({
    runbooks: currentState.remediationRunbooks,
    history: remediationEngine.remediationHistory,
    actionableFindings: currentState.recentFindings.filter(f => f.status !== "Remediated")
  });
});

// Execute Remediation Action
app.post("/api/remediation/execute", async (req, res) => {
  try {
    const { findingId, runbookId, approvedBy } = req.body;
    const result = await remediationEngine.executeRemediation({ findingId, runbookId, approvedBy });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 11. Defence-in-Depth Architecture
app.get("/api/defence-in-depth", (req, res) => {
  res.json({
    layers: currentState.defenceInDepthLayers,
    workload: {
      name: "Three-Tier Learner Data Application",
      ingress: "Internet -> ALB (HTTPS 443) in Public Subnets",
      appTier: "Amazon EC2 in Private App Subnets (IAM instance profile, SSM Session Manager)",
      dbTier: "Amazon RDS MySQL in Isolated Subnets (KMS encrypted, no internet route)",
      governance: "AWS Organizations SCPs, IAM Identity Center, CloudTrail, AWS Config"
    }
  });
});

// 12. Settings & AWS Credentials Management
app.post("/api/settings/credentials", async (req, res) => {
  const { accessKeyId, secretAccessKey, sessionToken, region } = req.body;

  const testResult = await awsManager.testConnection({
    accessKeyId: accessKeyId ? accessKeyId.trim() : "",
    secretAccessKey: secretAccessKey ? secretAccessKey.trim() : "",
    sessionToken: sessionToken ? sessionToken.trim() : "",
    region: region || "ap-south-1"
  });

  // Save to .env file for persistence if requested
  try {
    const envFilePath = path.join(__dirname, "..", ".env");
    const envContent = [
      `AWS_ACCESS_KEY_ID=${accessKeyId ? accessKeyId.trim() : ""}`,
      `AWS_SECRET_ACCESS_KEY=${secretAccessKey ? secretAccessKey.trim() : ""}`,
      `AWS_SESSION_TOKEN=${sessionToken ? sessionToken.trim() : ""}`,
      `AWS_DEFAULT_REGION=${region || "ap-south-1"}`,
      `PORT=${PORT}`
    ].join("\n");
    fs.writeFileSync(envFilePath, envContent, "utf8");
  } catch (err) {
    console.warn("Could not write .env file:", err.message);
  }

  if (testResult.success) {
    currentState.accountInfo.selectedRegion = region || "ap-south-1";
    res.json({
      success: true,
      message: "AWS connection verified successfully!",
      details: testResult.details
    });
  } else {
    res.json({
      success: false,
      message: testResult.error || "Failed to authenticate with AWS. Saved credentials, operating in reference mode.",
      error: testResult.error
    });
  }
});

// 13. Sync Live Data
app.post("/api/sync", async (req, res) => {
  if (!awsManager.isConnected) {
    return res.json({
      success: false,
      message: "AWS is not connected. Enter valid AWS credentials in Settings to sync live data.",
      live: false
    });
  }

  try {
    const liveData = await awsManager.fetchLiveSecurityData();
    res.json({
      success: true,
      message: "Successfully synchronized with live AWS environment.",
      liveData
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Reset State
app.post("/api/reset", (req, res) => {
  currentState = JSON.parse(JSON.stringify(referenceDataset));
  remediationEngine = new RemediationEngine(currentState);
  res.json({ success: true, message: "Platform state reset to initial reference baseline." });
});

// Serve built frontend assets if present
const distPath = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start Express Server
app.listen(PORT, () => {
  console.log(`SecureArch Server listening on http://localhost:${PORT}`);
});
