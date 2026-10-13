import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Search,
  CheckCircle2,
  Terminal,
  Activity,
  Layers
} from "lucide-react";

export default function AuditLogsView({ auditData }) {
  const { cloudTrail, alarms, recentEvents } = auditData;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = recentEvents.filter((ev) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      ev.event.toLowerCase().includes(q) ||
      (ev.user && ev.user.toLowerCase().includes(q)) ||
      (ev.details && ev.details.toLowerCase().includes(q)) ||
      (ev.resource && ev.resource.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Module 4 — AWS CloudTrail & Audit Logging</h1>
          <p className="page-subtitle">
            Tamper-evident activity logging across all AWS regions with log file validation SHA-256 digests and CloudWatch alarms.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <CheckCircle2 size={14} /> Multi-Region Trail Active
          </div>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <ShieldCheck size={14} /> SHA-256 Log Validation
          </div>
        </div>
      </div>

      {/* CloudTrail Summary Cards */}
      <div className="metrics-grid-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Trail Status */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">AWS CloudTrail Trail</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#D1FAE5" }}>
              <FileText size={20} color="#059669" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#059669" }}>
              {cloudTrail.trailName}
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Multi-Region: Yes &bull; S3 Management & Data Events
          </div>
        </div>

        {/* Log File Validation */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Log Integrity & Protection</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#EDE9FE" }}>
              <ShieldCheck size={20} color="#7C3AED" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#7C3AED" }}>
              SHA-256 Digest Active
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Encrypted with KMS CMK &bull; S3 Versioning Protected
          </div>
        </div>

        {/* Real-time Alerting */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">CloudWatch Metric Filters & SNS</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#FEF3C7" }}>
              <Bell size={20} color="#D97706" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#D97706" }}>
              6 Active Alarms
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Near real-time dispatch to security owner email
          </div>
        </div>
      </div>

      {/* CloudWatch Alarms Grid */}
      <div className="table-card" style={{ marginBottom: "24px" }}>
        <div className="card-title-row">
          <span className="card-title">CloudWatch Security Alarms & SNS Notification Pipeline</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Alarm Name</th>
              <th>Monitored Metric</th>
              <th>Threshold</th>
              <th>SNS Notification Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((a) => (
              <tr key={a.name}>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{a.name}</td>
                <td>{a.metric}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{a.threshold}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                  {a.topic}
                </td>
                <td>
                  <span className={`badge ${a.status === "OK" ? "badge-remediated" : "badge-critical"}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CloudTrail Live Audit Stream */}
      <div className="table-card">
        <div className="card-title-row">
          <div>
            <span className="card-title">CloudTrail Activity Stream</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "12px" }}>
              Every IAM, KMS, VPC, and S3 action recorded
            </span>
          </div>

          <div style={{ position: "relative", width: "260px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search audit trail..."
              className="search-input"
              style={{ height: "32px", paddingLeft: "32px", fontSize: "12px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>User / Role</th>
              <th>Details & Action</th>
              <th>Resource Target</th>
              <th>Timestamp</th>
              <th>Region</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((ev) => (
              <tr key={ev.id}>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Terminal size={14} color="#2563EB" />
                    <span>{ev.event}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{ev.user || "SecureArchAdmin"}</td>
                <td style={{ fontSize: "12px" }}>{ev.details}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", maxWidth: "200px", wordBreak: "break-all" }}>
                  {ev.resource || "AWS Account"}
                </td>
                <td style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ev.time}</td>
                <td style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ev.region}</td>
                <td>
                  <span className="badge badge-remediated">{ev.status || "Success"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
