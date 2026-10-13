import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import OverviewView from "./views/OverviewView.jsx";
import RiskFindingsView from "./views/RiskFindingsView.jsx";
import IamView from "./views/IamView.jsx";
import NetworkView from "./views/NetworkView.jsx";
import DataProtectionView from "./views/DataProtectionView.jsx";
import AuditLogsView from "./views/AuditLogsView.jsx";
import ComplianceView from "./views/ComplianceView.jsx";
import RemediationView from "./views/RemediationView.jsx";
import ArchitectureView from "./views/ArchitectureView.jsx";
import SettingsView from "./views/SettingsView.jsx";

export default function App() {
  const [currentTab, setCurrentTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isLiveAws, setIsLiveAws] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("ap-south-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Application Data States
  const [accountInfo, setAccountInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [recentAuditActivity, setRecentAuditActivity] = useState([]);
  const [recentFindings, setRecentFindings] = useState([]);
  const [riskRegister, setRiskRegister] = useState([]);
  const [iamData, setIamData] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  const [dataProtectionData, setDataProtectionData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [remediationData, setRemediationData] = useState(null);
  const [architectureData, setArchitectureData] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAllData = async () => {
    try {
      const [
        statusRes,
        overviewRes,
        findingsRes,
        riskRes,
        iamRes,
        networkRes,
        dpRes,
        auditRes,
        compRes,
        remRes,
        archRes
      ] = await Promise.all([
        fetch("/api/status").then((r) => r.json()),
        fetch("/api/overview").then((r) => r.json()),
        fetch("/api/findings").then((r) => r.json()),
        fetch("/api/risk-register").then((r) => r.json()),
        fetch("/api/iam").then((r) => r.json()),
        fetch("/api/network").then((r) => r.json()),
        fetch("/api/data-protection").then((r) => r.json()),
        fetch("/api/audit-logs").then((r) => r.json()),
        fetch("/api/compliance").then((r) => r.json()),
        fetch("/api/remediation").then((r) => r.json()),
        fetch("/api/defence-in-depth").then((r) => r.json())
      ]);

      setIsLiveAws(statusRes.isLiveAws);
      setSelectedRegion(statusRes.region || "ap-south-1");
      setAccountInfo(overviewRes.accountInfo);
      setMetrics(overviewRes.metrics);
      setRecentAuditActivity(overviewRes.recentAuditActivity);
      setRecentFindings(findingsRes.findings);
      setRiskRegister(riskRes.risks);
      setIamData(iamRes.details);
      setNetworkData(networkRes.details);
      setDataProtectionData(dpRes.details);
      setAuditData(auditRes);
      setComplianceData(compRes);
      setRemediationData(remRes);
      setArchitectureData(archRes);
    } catch (err) {
      console.error("Failed to fetch platform data:", err);
      showToast("Error connecting to backend server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRemediate = async (findingId, runbookId, approvedBy = "Arjun") => {
    try {
      const res = await fetch("/api/remediation/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findingId, runbookId, approvedBy })
      }).then((r) => r.json());

      if (res.success) {
        showToast(res.message, "success");
        fetchAllData();
        return res;
      } else {
        showToast(res.error || "Remediation failed", "error");
        return res;
      }
    } catch (err) {
      showToast("Failed to execute remediation: " + err.message, "error");
      throw err;
    }
  };

  const handleSaveCredentials = async (credentials) => {
    try {
      const res = await fetch("/api/settings/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      }).then((r) => r.json());

      if (res.success) {
        showToast("AWS credentials connected and verified via STS!", "success");
      } else {
        showToast(res.message, "warning");
      }
      fetchAllData();
      return res;
    } catch (err) {
      showToast("Error saving credentials: " + err.message, "error");
      throw err;
    }
  };

  const handleSyncLive = async () => {
    try {
      const res = await fetch("/api/sync", { method: "POST" }).then((r) => r.json());
      if (res.success) {
        showToast("Synchronized with live AWS environment!", "success");
        fetchAllData();
      } else {
        showToast(res.message, "warning");
      }
    } catch (err) {
      showToast("Sync failed: " + err.message, "error");
    }
  };

  const handleResetBaseline = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" }).then((r) => r.json());
      showToast(res.message, "success");
      fetchAllData();
    } catch (err) {
      showToast("Reset failed: " + err.message, "error");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-main)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "8px" }}>
            SecureArch
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Loading AWS Cloud Security & Posture Monitoring...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "30px",
            zIndex: 1000,
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "var(--shadow-lg)",
            backgroundColor: toast.type === "error" ? "var(--danger)" : toast.type === "warning" ? "var(--warning)" : "var(--primary)",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            animation: "fadeIn 0.3s ease"
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        findingCount={metrics?.criticalFindings + metrics?.highSeverityFindings || 11}
        accountInfo={accountInfo}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          accountInfo={accountInfo}
          onRefresh={fetchAllData}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          isLiveAws={isLiveAws}
          onOpenSettings={() => setCurrentTab("settings")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="content-area">
          {currentTab === "overview" && (
            <OverviewView
              metrics={metrics}
              recentAuditActivity={recentAuditActivity}
              recentFindings={recentFindings}
              onNavigate={setCurrentTab}
              onRemediateQuick={handleRemediate}
            />
          )}

          {currentTab === "findings" && (
            <RiskFindingsView
              findings={recentFindings}
              riskRegister={riskRegister}
              onRemediate={handleRemediate}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === "iam" && (
            <IamView iamData={iamData} isLiveAws={isLiveAws} />
          )}

          {currentTab === "network" && (
            <NetworkView networkData={networkData} />
          )}

          {currentTab === "data-protection" && (
            <DataProtectionView dataProtectionData={dataProtectionData} />
          )}

          {currentTab === "audit-logs" && (
            <AuditLogsView auditData={auditData} />
          )}

          {currentTab === "compliance" && (
            <ComplianceView
              complianceData={complianceData}
              onReevaluate={fetchAllData}
            />
          )}

          {currentTab === "remediation" && (
            <RemediationView
              remediationData={remediationData}
              onExecuteRemediation={handleRemediate}
            />
          )}

          {currentTab === "architecture" && (
            <ArchitectureView architectureData={architectureData} />
          )}

          {currentTab === "settings" && (
            <SettingsView
              accountInfo={accountInfo}
              isLiveAws={isLiveAws}
              onSaveCredentials={handleSaveCredentials}
              onSyncLive={handleSyncLive}
              onResetBaseline={handleResetBaseline}
            />
          )}
        </main>
      </div>
    </div>
  );
}
