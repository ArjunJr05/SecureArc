import React, { useState } from "react";
import {
  Layers,
  Shield,
  Server,
  Database,
  Lock,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  GitCommit
} from "lucide-react";

export default function ArchitectureView({ architectureData }) {
  const { layers, workload } = architectureData;
  const [selectedLayer, setSelectedLayer] = useState(layers[0]);

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Defence-in-Depth Architecture Visualizer</h1>
          <p className="page-subtitle">
            Concentric six-layer security model protecting personal learner data on AWS (Chapter 3 & Figure 3.2).
          </p>
        </div>

        <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
          <CheckCircle2 size={14} /> 6 Independent Control Layers
        </div>
      </div>

      {/* Two Column Layout: Concentric Layers & Layer Detail */}
      <div className="tables-grid-2" style={{ marginBottom: "24px" }}>
        {/* Interactive 6-Layer Stack */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Figure 3.2 — Concentric Defence-in-Depth Layers</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Click layer to inspect</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {layers.map((l) => {
              const isSelected = selectedLayer.level === l.level;
              return (
                <div
                  key={l.level}
                  onClick={() => setSelectedLayer(l)}
                  style={{
                    padding: "14px 18px",
                    borderRadius: "8px",
                    borderLeft: `5px solid ${l.color}`,
                    background: isSelected ? "var(--primary-light)" : "var(--bg-main)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: isSelected ? `1px solid ${l.color}` : "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                        Layer {l.level}: {l.layer}
                      </span>
                      <span className="badge badge-remediated" style={{ fontSize: "10px" }}>{l.status}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                      {l.services}
                    </div>
                  </div>

                  <ArrowRight size={16} color={isSelected ? "var(--primary)" : "var(--text-muted)"} />
                </div>
              );
            })}

            {/* Core Protected Asset */}
            <div
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                color: "#FFFFFF",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              CORE PROTECTED ASSET: Learner / PII Data & Workload Database
            </div>
          </div>
        </div>

        {/* Selected Layer Deep Dive */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Layer {selectedLayer.level} Deep Dive: {selectedLayer.layer}</span>
            <span
              className="badge"
              style={{ backgroundColor: `${selectedLayer.color}20`, color: selectedLayer.color, fontWeight: 700 }}
            >
              Layer {selectedLayer.level} of 6
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
            <div>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>AWS Services Employed:</span>
              <div style={{ background: "var(--bg-main)", padding: "10px", borderRadius: "6px", marginTop: "6px", fontWeight: 500 }}>
                {selectedLayer.services}
              </div>
            </div>

            <div>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Defence-in-Depth Role:</span>
              <p style={{ marginTop: "6px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {selectedLayer.description}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Failure Resilience:</span>
              <p style={{ marginTop: "6px", color: "var(--text-secondary)", lineHeight: 1.5, fontSize: "12.5px" }}>
                In accordance with the Well-Architected Security Pillar, even if an adversary circumvents preceding perimeter controls, this independent layer stops lateral traversal, enforces cryptographic authorization, and emits audit evidence to CloudTrail.
              </p>
            </div>

            <div style={{ background: "var(--bg-main)", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                Audit & Compliance Mapping:
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Mapped to CIS AWS Foundations Benchmark v3.0 &bull; Evaluated continuously by AWS Config recorder.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Workload Architecture Card (Figure 3.1) */}
      <div className="table-card">
        <div className="card-title-row">
          <span className="card-title">Figure 3.1 — Reference Workload Architecture (Three-Tier VPC & Cloud Security)</span>
        </div>

        <div
          style={{
            background: "var(--bg-main)",
            padding: "24px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              {workload.name}
            </h3>

            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <strong>Tier 1 (Ingress):</strong> {workload.ingress}
              </div>
              <div>
                <strong>Tier 2 (Compute):</strong> {workload.appTier}
              </div>
              <div>
                <strong>Tier 3 (Data):</strong> {workload.dbTier}
              </div>
              <div>
                <strong>Governance & Auditing:</strong> {workload.governance}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", marginBottom: "6px" }}>
                Well-Architected Alignment
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                All six design principles of the Security Pillar are implemented with zero single point of security failure.
              </p>
            </div>

            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px" }}>
              Region: us-east-1 / ap-south-1 &bull; 2 Availability Zones
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
