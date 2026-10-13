import React from "react";
import {
  Home,
  AlertTriangle,
  Users,
  Network,
  Database,
  FileText,
  ShieldCheck,
  Wrench,
  Settings,
  Layers,
  MapPin,
  User,
  Mail,
  CloudLightning
} from "lucide-react";

export default function Sidebar({ currentTab, onSelectTab, findingCount = 12, accountInfo }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "findings", label: "Risk Findings", icon: AlertTriangle, badge: findingCount },
    { id: "iam", label: "IAM & Access Control", icon: Users },
    { id: "network", label: "Network Security", icon: Network },
    { id: "data-protection", label: "Encryption & Storage", icon: Database },
    { id: "audit-logs", label: "Audit Logs", icon: FileText },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
    { id: "remediation", label: "Remediation", icon: Wrench },
    { id: "architecture", label: "Architecture", icon: Layers },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <CloudLightning size={22} />
        </div>
        <div className="brand-text-wrapper">
          <span className="brand-title">SecureArch</span>
          <span className="brand-subtitle">AWS Cloud Security Monitoring</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(item.id)}
            >
              <div className="nav-item-left">
                <Icon size={18} className="nav-icon" />
                <span className="nav-text">{item.label}</span>
              </div>
              {item.badge && !isActive && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Metadata Card matching Figure 4.4.6 */}
      <div className="sidebar-footer">
        <div className="info-card">
          <div className="info-row">
            <MapPin size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div className="info-label">AWS Region</div>
              <div className="info-value">{accountInfo?.selectedRegion === "ap-south-1" ? "Mumbai (ap-south-1)" : accountInfo?.selectedRegion || "Mumbai (ap-south-1)"}</div>
            </div>
          </div>

          <div className="info-row">
            <User size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div className="info-label">Project Owner</div>
              <div className="info-value">{accountInfo?.projectOwner || "Arjun"} (23UAI015)</div>
            </div>
          </div>

          <div className="info-row">
            <Mail size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div className="info-label">College Email</div>
              <div className="info-value">{accountInfo?.collegeEmail || "btechaids23210@smvec.ac.in"}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
