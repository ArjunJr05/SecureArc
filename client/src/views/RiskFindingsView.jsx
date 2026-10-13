import React, { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  ExternalLink,
  Wrench,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Info
} from "lucide-react";

export default function RiskFindingsView({
  findings,
  riskRegister,
  onRemediate,
  searchQuery
}) {
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'register'
  const [inspectFinding, setInspectFinding] = useState(null);

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    if (selectedSeverity !== "all" && f.severity.toLowerCase() !== selectedSeverity.toLowerCase()) return false;
    if (selectedService !== "all" && f.service.toLowerCase() !== selectedService.toLowerCase()) return false;
    if (selectedStatus !== "all" && f.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.title.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || f.resource.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Risk Findings & Risk Register</h1>
          <p className="page-subtitle">
            Continuous threat detection from AWS Config and CloudTrail mapped to the Well-Architected Security Pillar.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: "flex", gap: "8px", background: "var(--border-subtle)", padding: "4px", borderRadius: "8px" }}>
          <button
            className={`btn btn-sm ${activeTab === "active" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("active")}
          >
            Active Findings ({filteredFindings.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === "register" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("register")}
          >
            Documented Risk Register (Report Table)
          </button>
        </div>
      </div>

      {activeTab === "active" ? (
        <>
          {/* Filters Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              padding: "12px 16px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              <Filter size={15} /> Filters:
            </div>

            <select
              className="card-dropdown"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="card-dropdown"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">All AWS Services</option>
              <option value="s3">Amazon S3</option>
              <option value="iam">AWS IAM</option>
              <option value="ec2">Amazon EC2</option>
              <option value="vpc">Amazon VPC</option>
              <option value="kms">AWS KMS</option>
              <option value="rds">Amazon RDS</option>
            </select>

            <select
              className="card-dropdown"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="under review">Under Review</option>
              <option value="remediation pending">Remediation Pending</option>
              <option value="remediated">Remediated</option>
            </select>
          </div>

          {/* Findings Table */}
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Description</th>
                  <th>Severity</th>
                  <th>Service</th>
                  <th>Affected Resource</th>
                  <th>Detected</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFindings.map((f) => {
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
                      <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                        {f.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", maxWidth: "320px" }}>
                          {f.description}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${sevClass}`}>{f.severity}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{f.service}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", maxWidth: "220px", wordBreak: "break-all" }}>
                        {f.resource}
                      </td>
                      <td style={{ fontSize: "11px", color: "var(--text-muted)" }}>{f.detectedTime}</td>
                      <td>
                        <span className={`badge ${statusClass}`}>{f.status}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setInspectFinding(f)}
                            title="Inspect Details"
                          >
                            <Info size={13} />
                          </button>
                          {f.status !== "Remediated" && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => onRemediate(f.id, f.remediationId)}
                              title="Execute SSM Runbook"
                            >
                              <Wrench size={13} /> Remediate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Documented Risk Register (Exact Report Table) */
        <div className="table-card">
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
              Section 4.4.1 Step 3: Documented Risk & Remediation Register
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Risks identified in the reference workload, mapped to control services, severity level, and automated remediation.
            </p>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>No.</th>
                <th>Risk Identified</th>
                <th>Severity</th>
                <th>Recommended Remediation</th>
                <th>Control / Service</th>
                <th>Posture Status</th>
                <th>Audit Verified</th>
              </tr>
            </thead>
            <tbody>
              {riskRegister.map((r) => {
                const sevClass =
                  r.severity === "Critical" ? "badge-critical" :
                  r.severity === "High" ? "badge-high" :
                  r.severity === "Medium" ? "badge-medium" : "badge-low";

                return (
                  <tr key={r.no}>
                    <td style={{ fontWeight: 700 }}>{r.no}</td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{r.risk}</td>
                    <td>
                      <span className={`badge ${sevClass}`}>{r.severity}</span>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{r.remediation}</td>
                    <td style={{ fontWeight: 500 }}>{r.controlService}</td>
                    <td>
                      <span className={`badge ${r.status === "Remediated" ? "badge-remediated" : "badge-open"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.verified ? (
                        <span style={{ color: "#059669", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 }}>
                          <CheckCircle2 size={15} /> Yes
                        </span>
                      ) : (
                        <span style={{ color: "#D97706", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                          <AlertTriangle size={15} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Modal */}
      {inspectFinding && (
        <div className="modal-overlay" onClick={() => setInspectFinding(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span className="badge badge-critical">{inspectFinding.severity} Finding</span>
                <h2 style={{ fontSize: "18px", fontWeight: 700, marginTop: "8px" }}>{inspectFinding.title}</h2>
                <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  {inspectFinding.id} &bull; AWS Rule: {inspectFinding.rule}
                </span>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--text-muted)" }}
                onClick={() => setInspectFinding(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div>
                <strong>Affected Resource ARN:</strong>
                <div style={{ fontFamily: "var(--font-mono)", background: "var(--bg-main)", padding: "8px", borderRadius: "6px", marginTop: "4px" }}>
                  {inspectFinding.resource}
                </div>
              </div>

              <div>
                <strong>Threat & Impact Description:</strong>
                <p style={{ marginTop: "4px", color: "var(--text-secondary)" }}>
                  {inspectFinding.description}
                </p>
              </div>

              <div>
                <strong>Recommended Remediation Plan:</strong>
                <p style={{ marginTop: "4px", color: "var(--text-secondary)" }}>
                  {inspectFinding.remediationPlan}
                </p>
              </div>

              <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button className="btn btn-outline" onClick={() => setInspectFinding(null)}>
                  Close
                </button>
                {inspectFinding.status !== "Remediated" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onRemediate(inspectFinding.id, inspectFinding.remediationId);
                      setInspectFinding(null);
                    }}
                  >
                    <Wrench size={14} /> Execute Remediation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
