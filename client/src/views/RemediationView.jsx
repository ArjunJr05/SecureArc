import React, { useState } from "react";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Terminal,
  ShieldAlert,
  Clock,
  User,
  History
} from "lucide-react";

export default function RemediationView({ remediationData, onExecuteRemediation }) {
  const { runbooks, history, actionableFindings } = remediationData;
  const [selectedFindingId, setSelectedFindingId] = useState(actionableFindings[0]?.id || "");
  const [selectedRunbookId, setSelectedRunbookId] = useState(runbooks[0]?.id || "");
  const [approverName, setApproverName] = useState("Arjun (Security Owner)");
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const handleExecute = async () => {
    if (!selectedFindingId) return;
    setExecuting(true);
    setExecutionResult(null);

    try {
      const res = await onExecuteRemediation(selectedFindingId, selectedRunbookId, approverName);
      setExecutionResult(res);
    } catch (err) {
      setExecutionResult({ success: false, error: err.message });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Automated & Manual Remediation</h1>
          <p className="page-subtitle">
            AWS Systems Manager (SSM) Automation runbooks and approval-based corrective actions for drift remediation.
          </p>
        </div>

        <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
          <CheckCircle2 size={14} /> SSM Automation Enabled
        </div>
      </div>

      {/* Two Column Layout: Execution Console & Available Runbooks */}
      <div className="tables-grid-2" style={{ marginBottom: "24px" }}>
        {/* Execution Console */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Remediation Execution Console</span>
            <span className="badge badge-low">Figure 4.4.4 Workflow</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Select Finding to Remediate:
              </label>
              {actionableFindings.length > 0 ? (
                <select
                  className="search-input"
                  value={selectedFindingId}
                  onChange={(e) => setSelectedFindingId(e.target.value)}
                  style={{ height: "40px" }}
                >
                  {actionableFindings.map((f) => (
                    <option key={f.id} value={f.id}>
                      [{f.id}] ({f.severity}) {f.title} — {f.service}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ padding: "12px", background: "var(--bg-main)", borderRadius: "6px", color: "#059669" }}>
                  <CheckCircle2 size={16} style={{ display: "inline", marginRight: "6px" }} />
                  All critical and high-severity findings have been remediated!
                </div>
              )}
            </div>

            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Target AWS SSM Automation Runbook:
              </label>
              <select
                className="search-input"
                value={selectedRunbookId}
                onChange={(e) => setSelectedRunbookId(e.target.value)}
                style={{ height: "40px" }}
              >
                {runbooks.map((rb) => (
                  <option key={rb.id} value={rb.id}>
                    {rb.name} ({rb.service})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Authorizing Security Owner:
              </label>
              <input
                type="text"
                className="search-input"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                style={{ height: "40px" }}
              />
            </div>

            <div style={{ marginTop: "8px" }}>
              <button
                className="btn btn-primary"
                onClick={handleExecute}
                disabled={executing || actionableFindings.length === 0}
                style={{ width: "100%", padding: "10px" }}
              >
                <Play size={15} />
                {executing ? "Executing SSM Runbook & Updating State..." : "Authorize & Execute Remediation"}
              </button>
            </div>

            {executionResult && (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: executionResult.success ? "var(--success-bg)" : "var(--danger-bg)",
                  color: executionResult.success ? "var(--success-text)" : "var(--danger-text)",
                  fontSize: "12.5px"
                }}
              >
                <strong>{executionResult.success ? "Success:" : "Failed:"}</strong> {executionResult.message || executionResult.error}
              </div>
            )}
          </div>
        </div>

        {/* Available SSM Runbooks */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Approved SSM Automation Documents</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {runbooks.map((rb) => (
              <div
                key={rb.id}
                style={{
                  padding: "12px",
                  background: "var(--bg-main)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "13px" }}>
                    {rb.name}
                  </span>
                  <span className="badge badge-low">{rb.service}</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {rb.description}
                </p>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                  Mode: {rb.executionMode} &bull; Targets: {rb.targetFinding}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remediation Audit History */}
      <div className="table-card">
        <div className="card-title-row">
          <span className="card-title">Remediation Execution History & CloudTrail Traceability</span>
        </div>

        {history.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Finding Title</th>
                <th>Runbook Used</th>
                <th>Authorized By</th>
                <th>Execution Time</th>
                <th>Status</th>
                <th>CloudTrail Event</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: "12px" }}>{h.id}</td>
                  <td>{h.title}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>{h.runbookId}</td>
                  <td>{h.approvedBy}</td>
                  <td style={{ fontSize: "11px", color: "var(--text-muted)" }}>{h.timestamp}</td>
                  <td>
                    <span className="badge badge-remediated">{h.newStatus}</span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--primary)" }}>
                    {h.cloudTrailEventId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "13px" }}>
            No remediation runbooks executed in this session yet. Runbooks can be executed from the console above or from the Risk Findings table.
          </div>
        )}
      </div>
    </div>
  );
}
