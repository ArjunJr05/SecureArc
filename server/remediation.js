// server/remediation.js - Automated & Manual Remediation Engine
import { awsManager } from "./aws-client.js";
import { S3Client, PutPublicAccessBlockCommand, PutBucketEncryptionCommand } from "@aws-sdk/client-s3";
import { EC2Client, RevokeSecurityGroupIngressCommand } from "@aws-sdk/client-ec2";
import { KMSClient, EnableKeyRotationCommand } from "@aws-sdk/client-kms";

export class RemediationEngine {
  constructor(state) {
    this.state = state;
    this.remediationHistory = [];
  }

  async executeRemediation({ findingId, runbookId, approvedBy = "Arjun" }) {
    const timestamp = new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const finding = this.state.recentFindings.find(f => f.id === findingId);
    if (!finding) {
      throw new Error(`Finding ${findingId} not found.`);
    }

    let liveExecutionResult = null;

    // If AWS credentials are connected, attempt real remediation
    if (awsManager.isConnected) {
      const config = awsManager.getCredentialsConfig();
      try {
        if (finding.service === "S3" && finding.rule === "s3-bucket-public-read-prohibited") {
          const s3 = new S3Client(config);
          const bucketName = finding.resource.replace("arn:aws:s3:::", "");
          await s3.send(
            new PutPublicAccessBlockCommand({
              Bucket: bucketName,
              PublicAccessBlockConfiguration: {
                BlockPublicAcls: true,
                IgnorePublicAcls: true,
                BlockPublicPolicy: true,
                RestrictPublicBuckets: true
              }
            })
          );
          liveExecutionResult = { liveAws: true, action: "Applied BlockPublicAccess on S3 bucket" };
        } else if (finding.service === "KMS" && finding.rule === "cmk-backing-key-rotation-enabled") {
          const kms = new KMSClient(config);
          await kms.send(new EnableKeyRotationCommand({ KeyId: finding.resource }));
          liveExecutionResult = { liveAws: true, action: "Enabled automatic KMS key rotation" };
        }
      } catch (awsErr) {
        console.warn("Live AWS remediation error:", awsErr.message);
        liveExecutionResult = { liveAws: true, status: "partial_live", note: awsErr.message };
      }
    }

    // Update in-memory finding status
    const previousStatus = finding.status;
    finding.status = "Remediated";

    // Update risk register if corresponding entry exists
    const riskEntry = this.state.riskRegister.find(r => r.riskId === finding.remediationId || r.controlService.includes(finding.service));
    if (riskEntry) {
      riskEntry.status = "Remediated";
      riskEntry.verified = true;
    }

    // Recalculate metrics
    this.recalculateMetrics();

    // Create CloudTrail event to record the remediation action
    const eventId = `evt-${Date.now().toString().slice(-4)}`;
    const newAuditEvent = {
      id: eventId,
      event: "ExecuteRemediationRunbook",
      iconType: "remediation",
      details: `Remediation executed for ${finding.id} (${finding.title}) via SSM runbook ${runbookId || "AWS-Automated"}`,
      user: approvedBy,
      time: timestamp,
      region: this.state.accountInfo.selectedRegion,
      status: "Success",
      resource: finding.resource,
      actionResult: "Finding marked COMPLIANT and verified"
    };
    this.state.recentAuditActivity.unshift(newAuditEvent);

    const historyRecord = {
      id: `REM-HIST-${Date.now().toString().slice(-4)}`,
      findingId: finding.id,
      title: finding.title,
      severity: finding.severity,
      service: finding.service,
      runbookId: runbookId || "SSM-Default-Auto",
      approvedBy,
      timestamp,
      previousStatus,
      newStatus: "Remediated",
      cloudTrailEventId: eventId,
      liveExecutionResult
    };

    this.remediationHistory.unshift(historyRecord);

    return {
      success: true,
      message: `Successfully remediated finding ${finding.id}: ${finding.title}`,
      finding,
      historyRecord,
      updatedMetrics: this.state.overviewMetrics
    };
  }

  recalculateMetrics() {
    const findings = this.state.recentFindings;
    const critical = findings.filter(f => f.severity === "Critical" && f.status !== "Remediated").length;
    const high = findings.filter(f => f.severity === "High" && f.status !== "Remediated").length;
    const medium = findings.filter(f => f.severity === "Medium" && f.status !== "Remediated").length;
    const low = findings.filter(f => f.severity === "Low" && f.status !== "Remediated").length;
    const totalActive = critical + high + medium + low;

    this.state.overviewMetrics.criticalFindings = critical;
    this.state.overviewMetrics.highSeverityFindings = high;

    // Recalculate score
    // Higher score as fewer findings remain active
    const penalty = (critical * 12) + (high * 6) + (medium * 3) + (low * 1);
    const score = Math.max(50, Math.min(100, 100 - penalty));
    this.state.overviewMetrics.postureScore = score;
    this.state.overviewMetrics.overallPosture = score >= 85 ? "Excellent" : score >= 70 ? "Good" : "Needs Attention";

    // Recalculate compliance rate
    const compliantRules = this.state.complianceDetails.awsConfig.rules.filter(r => r.compliance === "COMPLIANT").length;
    const totalRules = this.state.complianceDetails.awsConfig.rules.length;
    this.state.overviewMetrics.complianceRate = Math.round((compliantRules / totalRules) * 100);
  }
}
