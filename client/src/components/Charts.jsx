import React, { useState } from "react";

// 1. Donut Chart: Security Findings by Severity
export function SeverityDonutChart({ data, total = 24 }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // SVG dimensions
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
      {/* SVG Donut */}
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.percentage;

            const isHovered = hoveredSegment === item.severity;

            return (
              <circle
                key={item.severity}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={() => setHoveredSegment(item.severity)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {hoveredSegment ? (data.find(d => d.severity === hoveredSegment)?.count || total) : total}
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
            {hoveredSegment || "Findings"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {data.map((item) => (
          <div
            key={item.severity}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12.5px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: hoveredSegment === item.severity ? "var(--bg-main)" : "transparent"
            }}
            onMouseEnter={() => setHoveredSegment(item.severity)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  display: "inline-block"
                }}
              />
              <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{item.severity}</span>
            </div>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {item.count} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Line / Area Chart: Compliance Over Time
export function ComplianceAreaChart({ data }) {
  const width = 360;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.rate / 100) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <div style={{ position: "relative", width: "100%", height: "200px" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = height - paddingY - (val / 100) * chartHeight;
          return (
            <g key={val}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                fontSize="9"
                fill="#94A3B8"
                textAnchor="end"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="2.5" />

        {/* Points & X-Labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={p.x}
              y={height - 10}
              fontSize="10"
              fill="#64748B"
              textAnchor="middle"
            >
              {p.date}
            </text>
          </g>
        ))}

        {/* 87% final pill badge */}
        {lastPoint && (
          <g transform={`translate(${lastPoint.x - 18}, ${lastPoint.y - 24})`}>
            <rect width="36" height="18" rx="4" fill="#2563EB" />
            <text x="18" y="13" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
              {lastPoint.rate}%
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// 3. Bar Chart: Findings by AWS Service
export function ServiceBarChart({ data }) {
  const maxVal = 10;
  const barWidth = 24;
  const chartHeight = 140;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "200px", justifyContent: "flex-end" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: `${chartHeight}px`, borderBottom: "1px solid #E2E8F0", paddingBottom: "2px" }}>
        {data.map((item) => {
          const heightPercent = (item.count / maxVal) * 100;
          return (
            <div
              key={item.service}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                height: "100%",
                justifyContent: "flex-end"
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)" }}>
                {item.count}
              </span>
              <div
                style={{
                  width: `${barWidth}px`,
                  height: `${heightPercent}%`,
                  backgroundColor: item.color,
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.4s ease"
                }}
                title={`${item.service}: ${item.count} findings`}
              />
            </div>
          );
        })}
      </div>

      {/* X Labels */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "8px" }}>
        {data.map((item) => (
          <span
            key={item.service}
            style={{
              fontSize: "11.5px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              width: "36px",
              textAlign: "center"
            }}
          >
            {item.service}
          </span>
        ))}
      </div>
    </div>
  );
}
