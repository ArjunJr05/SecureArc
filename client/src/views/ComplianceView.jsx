import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  CheckCircle2,
  XCircle,
  FileCheck,
  BarChart3,
  Layers
} from "lucide-react";

export default function ComplianceView({ complianceData, onReevaluate }) {
  const { config, complianceRate, complianceOverTime } = complianceData;
  const [evaluating, setEvaluating] = useState(false);

  const handleReevaluate = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      if (onReevaluate) onReevaluate();
    }, 1200);
  };

  const compliantCount = config.rules.filter((r) => r.compliance === "COMPLIANT").length;
  const nonCompliantCount = config.rules.filter((r) => r.compliance !== "COMPLIANT").length;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Module 4 — AWS Config & CIS Compliance</h1>
          <p className="page-subtitle">
            Continuous compliance evaluation against the CIS AWS Foundations Benchmark and Well-Architected Security Pillar.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleReevaluate} disabled={evaluating}>
          <RotateCw size={14} className={evaluating ? "spin-icon" : ""} />
          {evaluating ? "Evaluating Rules..." : "Re-evaluate AWS Config Rules"}
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="metrics-grid-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Compliance Rate */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">CIS Benchmark Compliance</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#D1FAE5" }}>
              <ShieldCheck size={20} color="#059669" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ color: "#059669" }}>
              {complianceRate}%
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            {compliantCount} of {config.totalRules} Rules Compliant
          </div>
        </div>

        {/* Configuration Recorder */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">AWS Config Recorder</span>
            <div className="metric-icon-box" style={{ backgroundColor: "#DBEAFE" }}>
              <FileCheck size={20} color="#2563EB" />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ fontSize: "20px", color: "#2563EB" }}>
              {config.recorderStatus}
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            Global IAM + All Regional Resources Included
          </div>
        </div>

        {/* Drift Status */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Detected Non-Compliant Drift</span>
            <div className="metric-icon-box" style={{ backgroundColor: nonCompliantCount > 0 ? "#FFEDD5" : "#D1FAE5" }}>
              <AlertTriangle size={20} color={nonCompliantCount > 0 ? "#D97706" : "#059669"} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value-huge" style={{ color: nonCompliantCount > 0 ? "#D97706" : "#059669" }}>
              {nonCompliantCount} Rules
            </span>
          </div>
          <div className="metric-footer" style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
            SSM Automation Remediation Actions Available
          </div>
        </div>
      </div>

      {/* 12 Managed Rules Table */}
      <div className="table-card" style={{ marginBottom: "24px" }}>
        <div className="card-title-row">
          <span className="card-title">12 CIS-Aligned AWS Config Managed Rules (Table 4.4.1)</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Config Rule Identifier</th>
              <th>Security Control Verified</th>
              <th>Linked Module</th>
              <th>Severity</th>
              <th>Compliance Status</th>
            </tr>
          </thead>
          <tbody>
            {config.rules.map((rule) => {
              const isComp = rule.compliance === "COMPLIANT";
              const sevClass =
                rule.severity === "Critical" ? "badge-critical" :
                rule.severity === "High" ? "badge-high" : "badge-medium";

              return (
                <tr key={rule.name}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {rule.name}
                  </td>
                  <td>{rule.control}</td>
                  <td>
                    <span className="badge badge-low">{rule.module}</span>
                  </td>
                  <td>
                    <span className={`badge ${sevClass}`}>{rule.severity}</span>
                  </td>
                  <td>
                    <span className={`badge ${isComp ? "badge-remediated" : "badge-open"}`}>
                      {isComp ? <CheckCircle2 size={13} style={{ display: "inline", marginRight: "3px" }} /> : <XCircle size={13} style={{ display: "inline", marginRight: "3px" }} />}
                      {rule.compliance}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
