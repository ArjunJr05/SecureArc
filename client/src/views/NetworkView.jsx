import React, { useState } from "react";
import {
  Network,
  Share2,
  Shield,
  ArrowRight,
  CheckCircle2,
  Server,
  Database,
  Globe,
  Radio,
  ExternalLink,
  Layers
} from "lucide-react";

export default function NetworkView({ networkData }) {
  const { vpc, subnets, securityGroups, nacls, vpcEndpoints, flowLogs } = networkData;
  const [activeTab, setActiveTab] = useState("subnets"); // 'subnets', 'sgs', 'endpoints', 'flowlogs'

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Module 2 — Network Security & Isolation</h1>
          <p className="page-subtitle">
            Three-tier VPC architecture across 2 AZs with chained security groups, isolated database subnets, and zero direct SSH.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <CheckCircle2 size={14} /> Only Port 443 Exposed
          </div>
          <div className="badge badge-remediated" style={{ padding: "6px 12px", fontSize: "12px" }}>
            <Shield size={14} /> DB Isolated (No Internet Route)
          </div>
        </div>
      </div>

      {/* VPC Summary Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
          color: "#FFFFFF",
          borderRadius: "var(--radius-md)",
          padding: "20px 24px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>
            Virtual Private Cloud
          </span>
          <h2 style={{ fontSize: "22px", fontFamily: "var(--font-display)", fontWeight: 700, margin: "4px 0" }}>
            {vpc.vpcName} ({vpc.cidr})
          </h2>
          <span style={{ fontSize: "13px", opacity: 0.9 }}>
            ID: {vpc.vpcId} &bull; Region: {vpc.region} &bull; DNS Hostnames: Enabled &bull; Multi-AZ Design
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>6</div>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>Subnets (2 AZs)</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>4</div>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>Security Groups</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.15)", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>4</div>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>VPC Endpoints</div>
          </div>
        </div>
      </div>

      {/* Chained Security Groups Visual Diagram */}
      <div className="table-card" style={{ marginBottom: "24px" }}>
        <div className="card-title-row">
          <span className="card-title">Chained Security Group Architecture (Tier-to-Tier Least Privilege)</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Figure 4.2.4 from Report</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            background: "var(--bg-main)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          {/* 1. ALB-SG */}
          <div style={{ background: "var(--bg-card)", border: "1px solid #3B82F6", borderRadius: "10px", padding: "16px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2563EB", fontWeight: 700, fontSize: "14px" }}>
              <Globe size={18} /> ALB-SG
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Public Load Balancer</div>
            <div style={{ marginTop: "12px", fontSize: "12px" }}>
              <div style={{ color: "#059669", fontWeight: 600 }}>Inbound:</div>
              <div>TCP 443 &larr; 0.0.0.0/0 (HTTPS)</div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <div style={{ color: "#2563EB", fontWeight: 600 }}>Outbound:</div>
              <div>TCP 8080 &rarr; App-SG</div>
            </div>
          </div>

          {/* 2. App-SG */}
          <div style={{ background: "var(--bg-card)", border: "1px solid #10B981", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#059669", fontWeight: 700, fontSize: "14px" }}>
              <Server size={18} /> App-SG
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Private EC2 App Tier</div>
            <div style={{ marginTop: "12px", fontSize: "12px" }}>
              <div style={{ color: "#059669", fontWeight: 600 }}>Inbound:</div>
              <div>TCP 8080 &larr; ALB-SG only</div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <div style={{ color: "#2563EB", fontWeight: 600 }}>Outbound:</div>
              <div>TCP 3306 &rarr; DB-SG, 443 &rarr; Endpoints</div>
            </div>
          </div>

          {/* 3. DB-SG */}
          <div style={{ background: "var(--bg-card)", border: "1px solid #8B5CF6", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#7C3AED", fontWeight: 700, fontSize: "14px" }}>
              <Database size={18} /> DB-SG
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Isolated RDS MySQL Tier</div>
            <div style={{ marginTop: "12px", fontSize: "12px" }}>
              <div style={{ color: "#059669", fontWeight: 600 }}>Inbound:</div>
              <div>TCP 3306 &larr; App-SG only</div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <div style={{ color: "#64748B", fontWeight: 600 }}>Outbound:</div>
              <div>None (Local Only)</div>
            </div>
          </div>

          {/* 4. Endpoint-SG */}
          <div style={{ background: "var(--bg-card)", border: "1px solid #06B6D4", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0891B2", fontWeight: 700, fontSize: "14px" }}>
              <Radio size={18} /> Endpoint-SG
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>AWS PrivateLink APIs</div>
            <div style={{ marginTop: "12px", fontSize: "12px" }}>
              <div style={{ color: "#059669", fontWeight: 600 }}>Inbound:</div>
              <div>TCP 443 &larr; VPC 10.0.0.0/16</div>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <div style={{ color: "#64748B", fontWeight: 600 }}>Outbound:</div>
              <div>None (AWS Internal)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subnet Layout Table */}
      <div className="table-card" style={{ marginBottom: "24px" }}>
        <div className="card-title-row">
          <span className="card-title">Three-Tier Subnet Segmentation (High Availability)</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Subnet Name</th>
              <th>Availability Zone</th>
              <th>CIDR Block</th>
              <th>Tier</th>
              <th>Workload Role</th>
              <th>Route Target</th>
              <th>Public IP</th>
            </tr>
          </thead>
          <tbody>
            {subnets.map((s) => (
              <tr key={s.name}>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</td>
                <td>{s.az}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{s.cidr}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        s.tier === "Public" ? "#DBEAFE" :
                        s.tier === "Private" ? "#D1FAE5" : "#EDE9FE",
                      color:
                        s.tier === "Public" ? "#1E40AF" :
                        s.tier === "Private" ? "#065F46" : "#5B21B6"
                    }}
                  >
                    {s.tier}
                  </span>
                </td>
                <td>{s.purpose}</td>
                <td style={{ fontSize: "12px" }}>{s.route}</td>
                <td>
                  {s.publicIp ? (
                    <span className="badge badge-high">Yes (ALB/NAT)</span>
                  ) : (
                    <span className="badge badge-remediated">No (Private)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Two Column Section: VPC Endpoints & Flow Logs */}
      <div className="tables-grid-2">
        {/* VPC Endpoints */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Private VPC Endpoints (AWS PrivateLink)</span>
            <span className="badge badge-remediated">All API Calls Private</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {vpcEndpoints.map((ep) => (
              <div
                key={ep.service}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "var(--bg-main)",
                  borderRadius: "8px",
                  fontSize: "12.5px"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{ep.service}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Type: {ep.type}</div>
                </div>
                <span className="badge badge-remediated">{ep.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VPC Flow Logs */}
        <div className="table-card">
          <div className="card-title-row">
            <span className="card-title">Amazon VPC Flow Logs</span>
            <span className="badge badge-remediated">{flowLogs.status}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Destination Log Group</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>{flowLogs.logGroup}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Traffic Captured</span>
              <strong>{flowLogs.trafficType}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>Log Encryption</span>
              <strong style={{ color: "#059669" }}>{flowLogs.encryption}</strong>
            </div>
            <div style={{ background: "var(--bg-main)", padding: "12px", borderRadius: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
              <strong>Zero Bastion Host / No SSH:</strong> Remote server troubleshooting is carried out exclusively through AWS Systems Manager Session Manager over encrypted TLS channels without opening inbound port 22.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
