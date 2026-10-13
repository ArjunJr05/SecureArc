import React from "react";
import {
  Database,
  Lock,
  Key,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Globe,
  FileCheck,
  Layers
} from "lucide-react";

export default function DataProtectionView({ dataProtectionData }) {
  const { kmsKey, s3Bucket, rdsEncryption, ebsEncryption, transitEncryption } = dataProtectionData;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Module 3 — Data Protection & AWS KMS</h1>
          <p className="page-subtitle">
            Customer managed key encryption at rest across S3, RDS, EBS, and CloudTrail, with TLS 1.2+ in transit.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <CheckCircle2 size={14} /> Annual KMS Key Rotation Active
          </div>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <Lock size={14} /> 100% S3 SSE-KMS Enforced
          </div>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="metrics-grid-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* KMS CMK */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">AWS KMS Customer Managed Key</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#EDE9FE" }}>
              <Key size={20} color="#7C3AED" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#7C3AED" }}>
              {kmsKey.alias}
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Status: {kmsKey.keyState} &bull; Auto-Rotation: {kmsKey.rotationPeriodDays} Days
          </div>
        </div>

        {/* S3 Protection */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Amazon S3 Storage Security</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#D1FAE5" }}>
              <ShieldCheck size={20} color="#059669" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#059669" }}>
              Block Public Access (4/4)
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            SSE-KMS + S3 Bucket Key Enabled
          </div>
        </div>

        {/* EBS & RDS */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Database & EBS Encryption</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#DBEAFE" }}>
              <HardDrive size={20} color="#2563EB" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#2563EB" }}>
              Encrypted by Default
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            RDS MySQL Multi-AZ + EBS Volume Default Encryption
          </div>
        </div>
      </div>

      {/* Envelope Encryption Diagram Card */}
      <div className="table-card" style={{ marginBottom: "24px" }}>
        <div className="card-title-row">
          <span className="card-title">Envelope Encryption Workflow (Figure 4.3.3)</span>
          <span className="badge badge-low">KMS Request Reduction</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            background: "var(--bg-main)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontWeight: 700, color: "#2563EB", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Key size={16} /> 1. CMK Governs Access
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              The Customer Managed Key (CMK) stays safely inside AWS KMS hardware security modules (FIPS 140-3). Applications never see plaintext master keys.
            </p>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontWeight: 700, color: "#059669", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Lock size={16} /> 2. Data Key Generated
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              KMS generates a unique 256-bit data key. The plaintext key encrypts learner data, and is immediately purged from RAM.
            </p>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontWeight: 700, color: "#7C3AED", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Database size={16} /> 3. S3 Bucket Key Caching
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              S3 Bucket Keys decrease KMS API request traffic and costs by up to 99% while maintaining strict IAM audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="tables-grid-2">
        {/* S3 & RDS Encryption Details */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Storage Encryption Configuration</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Target S3 Bucket</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{s3Bucket.bucketName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>S3 Server-Side Encryption</span>
              <strong style={{ color: "#059669" }}>{s3Bucket.encryption}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Block Public Access Status</span>
              <strong style={{ color: "#059669" }}>All 4 Settings Enabled (True)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>RDS MySQL Instance</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{rdsEncryption.instanceId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>RDS Storage Encryption</span>
              <strong style={{ color: "#059669" }}>CMK Encrypted (Primary, Standby & Snapshots)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Default EBS Volume Encryption</span>
              <strong style={{ color: "#059669" }}>Enforced Region-Wide</strong>
            </div>
          </div>
        </div>

        {/* Transit Encryption & Key Policy */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">In-Transit Encryption & Key Governance</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>In-Transit Protocol</span>
              <strong style={{ color: "#2563EB" }}>{transitEncryption.protocol}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Certificate Authority</span>
              <strong>{transitEncryption.certProvider}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>HTTP to HTTPS Redirect</span>
              <strong style={{ color: "#059669" }}>301 Redirect Enforced on ALB</strong>
            </div>

            <div style={{ background: "var(--bg-main)", padding: "14px", borderRadius: "8px", marginTop: "8px" }}>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                Separation of Duties in Key Policy
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Key Administrators (<code>SecureArchAdmin</code>) can rotate, describe and audit the key but CANNOT decrypt learner data. Key Users (<code>SecureArchAppRole</code>) can generate data keys and decrypt but CANNOT alter key policies or schedule key deletion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
