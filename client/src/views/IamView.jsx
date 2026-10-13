import React, { useState } from "react";
import {
  Users,
  Shield,
  Key,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  Check,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default function IamView({ iamData, isLiveAws }) {
  const [activePolicyTab, setActivePolicyTab] = useState("boundary"); // 'boundary' or 'appPolicy'
  const [copied, setCopied] = useState(false);

  const { roles, passwordPolicy, permissionBoundaryJson, appRolePolicyJson, accessAnalyzerStatus, credentialHygiene } = iamData;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Module 1 — Security Architecture & IAM</h1>
          <p className="page-subtitle">
            Least-privilege identity foundation, temporary credentials via STS, permission boundaries, and credential hygiene.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <CheckCircle2 size={14} /> Zero Long-Term Keys Enforced
          </div>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <ShieldCheck size={14} /> Mandatory MFA Active
          </div>
        </div>
      </div>

      {/* Top 3 Overview Cards */}
      <div className="metrics-grid-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Root Hardening */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Root Account Posture</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#D1FAE5" }}>
              <ShieldCheck size={20} color="#059669" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#059669" }}>
              Hardened
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Virtual MFA Active &bull; 0 Access Keys &bull; CloudWatch Alarm on Login
          </div>
        </div>

        {/* Access Analyzer */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">IAM Access Analyzer</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#DBEAFE" }}>
              <Shield size={20} color="#2563EB" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#2563EB" }}>
              Active (0 Findings)
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Continuous external resource sharing validation
          </div>
        </div>

        {/* Credential Hygiene */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Credential Hygiene</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#EDE9FE" }}>
              <UserCheck size={20} color="#7C3AED" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#7C3AED" }}>
              100% MFA
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            8 Federated Identities via IAM Identity Center
          </div>
        </div>
      </div>

      {/* IAM Roles Table */}
      <div className="table-card" style={{ marginBottom: "24px" }}>
        <div className="card-title-row">
          <span className="card-title">Architected IAM Roles & Permission Boundaries</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Role Type</th>
              <th>Identity Source</th>
              <th>MFA Enforced</th>
              <th>Permission Boundary</th>
              <th>Security Scope</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Key size={14} color="#2563EB" />
                    <span>{r.name}</span>
                  </div>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    {r.arn}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{r.type}</td>
                <td>{r.source}</td>
                <td>
                  {r.mfaEnforced ? (
                    <span className="badge badge-remediated">Required</span>
                  ) : (
                    <span className="badge badge-accepted-risk">EC2 Profile</span>
                  )}
                </td>
                <td>
                  <span className="badge badge-low">{r.boundaryAttached}</span>
                </td>
                <td style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "340px" }}>
                  {r.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Two Column Section: JSON Policies & Password Policy */}
      <div className="tables-grid-2">
        {/* Policy JSON Viewer */}
        <div className="table-card">
          <div className="card-title-row">
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={`btn btn-sm ${activePolicyTab === "boundary" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActivePolicyTab("boundary")}
              >
                Permission Boundary JSON
              </button>
              <button
                className={`btn btn-sm ${activePolicyTab === "appPolicy" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActivePolicyTab("appPolicy")}
              >
                App Least-Privilege JSON
              </button>
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleCopy(activePolicyTab === "boundary" ? permissionBoundaryJson : appRolePolicyJson)}
            >
              {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>

          <pre className="code-block" style={{ maxHeight: "360px" }}>
            {activePolicyTab === "boundary" ? permissionBoundaryJson : appRolePolicyJson}
          </pre>
        </div>

        {/* Password Policy & Guardrails */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">CIS-Aligned IAM Password Policy</span>
            <span className="badge badge-remediated">CIS 1.2+ Compliant</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Minimum Password Length</span>
              <strong>{passwordPolicy.minLength} Characters</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Require Character Complexity</span>
              <strong style={{ color: "#059669" }}>Uppercase, Lowercase, Numbers, Symbols</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Password Expiration (Max Age)</span>
              <strong>{passwordPolicy.maxAgeDays} Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Password Reuse Prevention</span>
              <strong>{passwordPolicy.preventReuse} Previous Passwords</strong>
            </div>

            <div style={{ marginTop: "12px", background: "var(--bg-main)", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                AWS Organizations Guardrail (SCP)
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Service Control Policies prevent any administrator from disabling CloudTrail, deleting Config recorders, or creating IAM users outside approved governance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
