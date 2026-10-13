import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Database,
  FileText,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Lock,
  Users,
  CheckCircle,
  ExternalLink,
  Terminal,
  Layers
} from "lucide-react";
import { SeverityDonutChart, ComplianceAreaChart, ServiceBarChart } from "../components/Charts.jsx";

export default function OverviewView({
  metrics,
  recentAuditActivity,
  recentFindings,
  onNavigate,
  onRemediateQuick
}) {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Centralized view of your AWS cloud security posture, compliance and monitoring.</p>
        </div>

        <div className="page-meta-row">
          <div className="timestamp-pill">
            <Calendar size={14} />
            <span>12 Oct 2026, 07:48 PM</span>
          </div>

          <div className="date-filter-select">
            <Calendar size={14} />
            <span>Last 30 days</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Top 6 Metric Cards Grid */}
      <div className="metrics-grid-6">
        {/* 1. Overall Security Posture */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Overall Security Posture</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#D1FAE5" }}>
              <ShieldCheck size={20} color="#059669" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ color: "#059669" }}>
              {metrics.overallPosture || "Good"}
            </span>
          </div>
          <div className="posture-bar-wrapper">
            <div className="posture-progress-track">
              <div
                className="posture-progress-fill"
                style={{ width: `${metrics.postureScore || 78}%` }}
              />
            </div>
            <div className="posture-score-label">
              {metrics.postureScore || 78} / {metrics.postureScoreMax || 100}
            </div>
          </div>
        </div>

        {/* 2. Critical Findings */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Critical Findings</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#FEE2E2" }}>
              <AlertCircle size={20} color="#DC2626" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge">{metrics.criticalFindings}</span>
          </div>
          <div className="metric-footer">
            <span className="trend-badge trend-up-bad">
              <ArrowUpRight size={13} /> {metrics.criticalChange || "+1 from last week"}
            </span>
          </div>
        </div>

        {/* 3. High-Severity Findings */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">High-Severity Findings</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#FFEDD5" }}>
              <AlertTriangle size={20} color="#D97706" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge">{metrics.highSeverityFindings}</span>
          </div>
          <div className="metric-footer">
            <span className="trend-badge trend-down-good">
              <ArrowDownRight size={13} /> {metrics.highChange || "-4 from last week"}
            </span>
          </div>
        </div>

        {/* 4. Compliance Rate */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Compliance Rate</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#DBEAFE" }}>
              <ShieldCheck size={20} color="#2563EB" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge">{metrics.complianceRate}%</span>
          </div>
          <div className="metric-footer">
            <span className="trend-badge trend-up-good">
              <ArrowUpRight size={13} /> {metrics.complianceChange || "+5% from last month"}
            </span>
          </div>
        </div>

        {/* 5. Encrypted Storage Resources */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Encrypted Storage Resources</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#EDE9FE" }}>
              <Database size={20} color="#7C3AED" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "22px" }}>
              {metrics.encryptedStorageRatio || "12 / 14"}
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            {metrics.encryptedStorageLabel || "SSE-KMS enabled"}
          </div>
        </div>

        {/* 6. CloudTrail Logging Status */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">CloudTrail Logging Status</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#D1FAE5" }}>
              <FileText size={20} color="#059669" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ color: "#059669" }}>
              {metrics.cloudTrailStatus || "Active"}
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            {metrics.cloudTrailLabel || "Multi-Region Trail"}
          </div>
        </div>
      </div>

      {/* 3 Charts Grid */}
      <div className="charts-grid-3">
        {/* Security Findings by Severity */}
        <div className="chart-card">
          <div className="card-title-row">
            <span className="card-title">Security Findings by Severity</span>
            <div className="card-dropdown">
              Last 30 days <ChevronDown size={12} style={{ display: "inline" }} />
            </div>
          </div>
          {metrics.findingsBySeverity && (
            <SeverityDonutChart
              data={metrics.findingsBySeverity.breakdown}
              total={metrics.findingsBySeverity.total}
            />
          )}
        </div>

        {/* Compliance Over Time */}
        <div className="chart-card">
          <div className="card-title-row">
            <span className="card-title">Compliance Over Time</span>
            <div className="card-dropdown">
              Last 30 days <ChevronDown size={12} style={{ display: "inline" }} />
            </div>
          </div>
          {metrics.complianceOverTime && (
            <ComplianceAreaChart data={metrics.complianceOverTime} />
          )}
        </div>

        {/* Findings by AWS Service */}
        <div className="chart-card">
          <div className="card-title-row">
            <span className="card-title">Findings by AWS Service</span>
            <div className="card-dropdown">
              Last 30 days <ChevronDown size={12} style={{ display: "inline" }} />
            </div>
          </div>
          {metrics.findingsByService && (
            <ServiceBarChart data={metrics.findingsByService} />
          )}
        </div>
      </div>

      {/* Tables Row: Recent Audit Activity & Recently Detected Findings */}
      <div className="tables-grid-2">
        {/* Recent Audit Activity */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Recent Audit Activity</span>
            <span className="card-view-all" onClick={() => onNavigate("audit-logs")}>
              View All <ArrowRight size={13} />
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
              <span style={{ width: "160px" }}>EVENT</span>
              <span style={{ flex: 1 }}>DETAILS</span>
              <span style={{ width: "130px" }}>TIME</span>
              <span style={{ width: "80px" }}>REGION</span>
            </div>

            {recentAuditActivity.slice(0, 5).map((act) => (
              <div key={act.id} className="activity-row">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "160px" }}>
                  <div
                    className="activity-icon"
                    style={{
                      backgroundColor:
                        act.event.includes("Login") ? "#FEE2E2" :
                        act.event.includes("Bucket") ? "#D1FAE5" :
                        act.event.includes("SecurityGroup") ? "#EDE9FE" :
                        act.event.includes("Role") ? "#FEE2E2" : "#FCE7F3",
                      color:
                        act.event.includes("Login") ? "#DC2626" :
                        act.event.includes("Bucket") ? "#059669" :
                        act.event.includes("SecurityGroup") ? "#7C3AED" :
                        act.event.includes("Role") ? "#DC2626" : "#DB2777"
                    }}
                  >
                    <Terminal size={14} />
                  </div>
                  <span className="activity-event-name" style={{ fontSize: "12px" }}>{act.event}</span>
                </div>
                <div className="activity-details" style={{ fontSize: "12px" }}>{act.details}</div>
                <div style={{ width: "130px", fontSize: "11px", color: "var(--text-muted)" }}>{act.time}</div>
                <div style={{ width: "80px", fontSize: "11px", color: "var(--text-muted)" }}>{act.region}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Detected Findings */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Recently Detected Findings</span>
            <span className="card-view-all" onClick={() => onNavigate("findings")}>
              View All <ArrowRight size={13} />
            </span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Finding ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>AWS Service</th>
                <th>Detected Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentFindings.slice(0, 5).map((f) => {
                const sevClass =
                  f.severity === "Critical" ? "badge-critical" :
                  f.severity === "High" ? "badge-high" :
                  f.severity === "Medium" ? "badge-medium" : "badge-low";

                const statusClass =
                  f.status === "Open" ? "badge-open" :
                  f.status === "Under Review" ? "badge-under-review" :
                  f.status === "Remediation Pending" ? "badge-remediation-pending" :
                  f.status === "Accepted Risk" ? "badge-accepted-risk" : "badge-remediated";

                return (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.id}</td>
                    <td style={{ maxWidth: "200px" }}>{f.title}</td>
                    <td>
                      <span className={`badge ${sevClass}`}>{f.severity}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{f.service}</td>
                    <td style={{ fontSize: "11px", color: "var(--text-muted)" }}>{f.detectedTime}</td>
                    <td>
                      <span className={`badge ${statusClass}`}>{f.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 4 Quick Stats Cards */}
      <div className="quick-stats-grid-4">
        {/* IAM Permission Risks */}
        <div className="quick-card">
          <div className="quick-card-top">
            <span className="quick-card-title">IAM Permission Risks</span>
            <span className="quick-card-link" onClick={() => onNavigate("iam")}>
              View <ArrowRight size={12} />
            </span>
          </div>
          <div className="quick-card-metric-row">
            <div style={{ backgroundColor: "#DBEAFE", padding: "8px", borderRadius: "8px" }}>
              <Users size={20} color="#2563EB" />
            </div>
            <div>
              <div className="quick-card-metric-number">2</div>
              <div className="quick-card-metric-label">Roles with excessive permissions</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            SecureArchAdmin, SecureArchAppRole
          </div>
        </div>

        {/* Encryption Coverage */}
        <div className="quick-card">
          <div className="quick-card-top">
            <span className="quick-card-title">Encryption Coverage</span>
            <span className="quick-card-link" onClick={() => onNavigate("data-protection")}>
              View <ArrowRight size={12} />
            </span>
          </div>
          <div className="quick-card-metric-row">
            <div style={{ backgroundColor: "#D1FAE5", padding: "8px", borderRadius: "8px" }}>
              <Lock size={20} color="#059669" />
            </div>
            <div>
              <div className="quick-card-metric-number">86%</div>
              <div className="quick-card-metric-label">Encrypted storage resources</div>
            </div>
          </div>
          <div className="posture-progress-track" style={{ height: "4px", marginTop: "4px" }}>
            <div className="posture-progress-fill" style={{ width: "86%", background: "#10B981" }} />
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            12 / 14 resources use SSE-KMS
          </div>
        </div>

        {/* AWS Config Compliance */}
        <div className="quick-card">
          <div className="quick-card-top">
            <span className="quick-card-title">AWS Config Compliance</span>
            <span className="quick-card-link" onClick={() => onNavigate("compliance")}>
              View <ArrowRight size={12} />
            </span>
          </div>
          <div className="quick-card-metric-row">
            <div style={{ backgroundColor: "#D1FAE5", padding: "8px", borderRadius: "8px" }}>
              <ShieldCheck size={20} color="#059669" />
            </div>
            <div>
              <div className="quick-card-metric-number">87%</div>
              <div className="quick-card-metric-label">Resources compliant</div>
            </div>
          </div>
          <div className="posture-progress-track" style={{ height: "4px", marginTop: "4px" }}>
            <div className="posture-progress-fill" style={{ width: "87%", background: "#10B981" }} />
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            74 / 85 resources
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="quick-card">
          <div className="quick-card-top">
            <span className="quick-card-title">Recommended Actions</span>
            <span className="quick-card-link" onClick={() => onNavigate("remediation")}>
              View <ArrowRight size={12} />
            </span>
          </div>
          <div className="quick-card-metric-row">
            <div style={{ backgroundColor: "#FEF3C7", padding: "8px", borderRadius: "8px" }}>
              <Terminal size={20} color="#D97706" />
            </div>
            <div>
              <div className="quick-card-metric-number">5</div>
              <div className="quick-card-metric-label">High priority remediation actions</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />
              <span>Enable encryption for S3 bucket (CFG-001)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />
              <span>Restrict IAM admin access (IAM-002)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F59E0B" }} />
              <span>Update security group rules (EC2-003)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
