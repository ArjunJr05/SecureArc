import React, { useState } from "react";
import { Search, RotateCw, Bell, ChevronDown, CheckCircle2, Cloud, AlertCircle, Shield } from "lucide-react";

export default function Header({
  accountInfo,
  onRefresh,
  selectedRegion,
  onRegionChange,
  isLiveAws,
  onOpenSettings,
  searchQuery,
  onSearchChange
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        {/* Region Selector */}
        <div className="region-selector" title="Select AWS Deployment Region">
          <Cloud size={16} color="#FF9900" />
          <span>aws</span>
          <select
            value={selectedRegion || "ap-south-1"}
            onChange={(e) => onRegionChange(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="ap-south-1">Mumbai (ap-south-1)</option>
            <option value="us-east-1">US East (us-east-1)</option>
            <option value="us-west-2">US West (us-west-2)</option>
            <option value="eu-west-1">Europe (eu-west-1)</option>
          </select>
        </div>

        {/* Global Search Bar */}
        <div className="search-bar-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search resources, findings, logs, or configurations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-kbd">Ctrl + K</span>
        </div>
      </div>

      <div className="header-right">
        {/* Live vs Reference Mode Indicator */}
        <div
          onClick={onOpenSettings}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600,
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            background: isLiveAws ? "rgba(16, 185, 129, 0.12)" : "rgba(37, 99, 235, 0.1)",
            color: isLiveAws ? "#059669" : "#2563EB",
            border: `1px solid ${isLiveAws ? "#10B981" : "#93C5FD"}`
          }}
          title="Click to configure AWS credentials & connection"
        >
          {isLiveAws ? <CheckCircle2 size={14} /> : <Shield size={14} />}
          <span>{isLiveAws ? "AWS Connected (Live)" : "Reference Baseline (SMVEC)"}</span>
        </div>

        {/* Refresh Button */}
        <button className="header-btn" onClick={onRefresh} title="Sync & Refresh Data">
          <RotateCw size={17} />
        </button>

        {/* Notifications Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="header-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Active Security Alerts"
          >
            <Bell size={17} />
            <span className="badge-counter">5</span>
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "44px",
                width: "320px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                boxShadow: "var(--shadow-lg)",
                padding: "16px",
                zIndex: 60
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>Security Alerts (5)</span>
                <span style={{ fontSize: "11px", color: "var(--primary)", cursor: "pointer" }}>Mark all read</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                <div style={{ padding: "8px", background: "var(--danger-bg)", borderRadius: "6px", color: "var(--danger-text)" }}>
                  <strong>Critical:</strong> S3 bucket secure-arch-data-temp unencrypted
                </div>
                <div style={{ padding: "8px", background: "var(--orange-bg)", borderRadius: "6px", color: "var(--orange-text)" }}>
                  <strong>High:</strong> IAM admin user without MFA
                </div>
                <div style={{ padding: "8px", background: "var(--orange-bg)", borderRadius: "6px", color: "var(--orange-text)" }}>
                  <strong>High:</strong> SG-0a8b open on port 22 to 0.0.0.0/0
                </div>
                <div style={{ padding: "8px", background: "var(--warning-bg)", borderRadius: "6px", color: "var(--warning-text)" }}>
                  <strong>Medium:</strong> KMS CMK rotation disabled on secondary key
                </div>
                <div style={{ padding: "8px", background: "var(--warning-bg)", borderRadius: "6px", color: "var(--warning-text)" }}>
                  <strong>Medium:</strong> RDS dev replica not KMS encrypted
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching Figure 4.4.6 */}
        <div className="user-profile" onClick={onOpenSettings} title="Student & Project Details">
          <div className="avatar">A</div>
          <div className="user-info">
            <span className="user-name">{accountInfo?.projectOwner || "Arjun"}</span>
            <span className="user-email">{accountInfo?.collegeEmail || "btechaids23210@smvec.ac.in"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
