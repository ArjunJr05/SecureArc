import React, { useState } from "react";
import {
  Key,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Server,
  Cloud,
  Save,
  Lock,
  Globe,
  HelpCircle,
  RefreshCw
} from "lucide-react";

export default function SettingsView({
  accountInfo,
  isLiveAws,
  onSaveCredentials,
  onSyncLive,
  onResetBaseline,
  connectionError
}) {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [region, setRegion] = useState(accountInfo?.selectedRegion || "ap-south-1");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await onSaveCredentials({
        accessKeyId,
        secretAccessKey,
        sessionToken,
        region
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">AWS Environment & Platform Settings</h1>
          <p className="page-subtitle">
            Configure your AWS credentials to connect SecureArch directly to your live AWS account, or operate in reference mode.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-outline" onClick={onResetBaseline} title="Reset all metrics to report baseline">
            <RotateCw size={14} /> Reset to Reference Baseline
          </button>
        </div>
      </div>

      {/* Connection Status Banner */}
      <div
        className={`aws-status-banner ${isLiveAws ? "banner-live" : "banner-mock"}`}
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isLiveAws ? <CheckCircle2 size={20} /> : <Shield size={20} />}
          <div>
            <div style={{ fontWeight: 700 }}>
              {isLiveAws ? "Connected to Live AWS Cloud" : "Operating in Reference / Demo Baseline Mode"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              {isLiveAws
                ? `Account ID: ${accountInfo?.accountId || "Unknown"} | ARN: ${accountInfo?.arn || ""} | Region: ${region}`
                : "Displaying verified reference data from Project Report (Arjun D, 23UAI015, SMVEC). Enter AWS keys below to connect live."}
            </div>
          </div>
        </div>

        {isLiveAws && (
          <button className="btn btn-primary btn-sm" onClick={onSyncLive}>
            <RefreshCw size={13} /> Sync Live AWS Data
          </button>
        )}
      </div>

      {/* Two Column Layout: Credentials Form & Instructions */}
      <div className="tables-grid-2">
        {/* AWS Credentials Form */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Connect AWS Credentials</span>
            <span className="badge badge-low">STS Caller Identity</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                AWS Access Key ID:
              </label>
              <input
                type="text"
                className="search-input"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                value={accessKeyId}
                onChange={(e) => setAccessKeyId(e.target.value)}
                style={{ height: "40px", fontFamily: "var(--font-mono)" }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                AWS Secret Access Key:
              </label>
              <input
                type="password"
                className="search-input"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value)}
                style={{ height: "40px", fontFamily: "var(--font-mono)" }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                AWS Session Token <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(Optional — for AWS Academy / Learner Lab / STS)</span>:
              </label>
              <textarea
                className="search-input"
                placeholder="AQoDYXdzEJr1... (leave blank for standard IAM user keys)"
                rows={3}
                value={sessionToken}
                onChange={(e) => setSessionToken(e.target.value)}
                style={{ height: "70px", fontFamily: "var(--font-mono)", padding: "8px", resize: "vertical" }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Target AWS Region:
              </label>
              <select
                className="search-input"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ height: "40px" }}
              >
                <option value="ap-south-1">Asia Pacific — Mumbai (ap-south-1)</option>
                <option value="us-east-1">US East — N. Virginia (us-east-1)</option>
                <option value="us-west-2">US West — Oregon (us-west-2)</option>
                <option value="eu-west-1">Europe — Ireland (eu-west-1)</option>
                <option value="ap-southeast-1">Asia Pacific — Singapore (ap-southeast-1)</option>
              </select>
            </div>

            <div style={{ marginTop: "8px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={testing}
                style={{ width: "100%", padding: "12px" }}
              >
                <Save size={15} />
                {testing ? "Testing AWS Connection via STS..." : "Save Credentials & Connect to AWS"}
              </button>
            </div>

            {testResult && (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: testResult.success ? "var(--success-bg)" : "var(--danger-bg)",
                  color: testResult.success ? "var(--success-text)" : "var(--danger-text)",
                  fontSize: "12.5px"
                }}
              >
                <strong>{testResult.success ? "Connected Successfully!" : "Connection Failed:"}</strong>{" "}
                {testResult.message || testResult.error}
                {testResult.details && (
                  <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    Account: {testResult.details.accountId} &bull; User: {testResult.details.arn}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Security & Instructions Box */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Setup Guidance & Least Privilege</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
            <div style={{ background: "var(--bg-main)", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                Where to get your AWS Credentials:
              </div>
              <ol style={{ paddingLeft: "20px", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "12.5px" }}>
                <li>Log in to the AWS Management Console.</li>
                <li>If using <strong>AWS Academy / Learner Lab</strong>: Click "AWS Details" in the lab interface to copy <code>AWS_ACCESS_KEY_ID</code>, <code>AWS_SECRET_ACCESS_KEY</code>, and <code>AWS_SESSION_TOKEN</code>.</li>
                <li>If using standard AWS: Go to IAM &rarr; Users &rarr; Security Credentials &rarr; Create Access Key.</li>
              </ol>
            </div>

            <div style={{ background: "var(--bg-main)", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                Required IAM Permissions for Full Sync:
              </div>
              <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "12px" }}>
                <li><code>sts:GetCallerIdentity</code> (Authentication test)</li>
                <li><code>iam:ListRoles, iam:GetAccountPasswordPolicy</code> (Module 1)</li>
                <li><code>ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups</code> (Module 2)</li>
                <li><code>s3:ListBuckets, s3:GetBucketEncryption, s3:GetPublicAccessBlock</code> (Module 3)</li>
                <li><code>kms:ListKeys, kms:ListAliases, kms:DescribeKey</code> (Module 3)</li>
                <li><code>cloudtrail:DescribeTrails, cloudtrail:LookupEvents</code> (Module 4)</li>
                <li><code>config:DescribeConfigRules, config:DescribeComplianceByConfigRule</code> (Module 4)</li>
              </ul>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              * Credentials are saved locally in your project's <code>.env</code> file and are never sent to third-party servers. All SDK requests run directly from your local Node.js backend to official AWS endpoints.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
