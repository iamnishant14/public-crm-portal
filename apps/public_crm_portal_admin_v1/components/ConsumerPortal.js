import React, { useState } from 'react';
import { useElectricity } from '../context/ElectricityContext';
import { COMPLAINT_CATEGORIES } from '../context/electricityData';

// ─── SVG Bar Chart Component ────────────────────────────────────────
function UsageBarChart({ readings }) {
  const maxKwh = Math.max(...readings.map(r => r.kwh), 1);
  const barWidth = 48;
  const gap = 12;
  const chartHeight = 180;
  const chartWidth = readings.length * (barWidth + gap);

  const getBarColor = (kwh) => {
    const ratio = kwh / maxKwh;
    if (ratio > 0.85) return 'var(--danger)';
    if (ratio > 0.6) return 'var(--warning)';
    return 'var(--primary)';
  };

  return (
    <div className="bar-chart-container">
      <svg width="100%" viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 40}`} preserveAspectRatio="xMidYMid meet">
        {readings.map((r, i) => {
          const barHeight = (r.kwh / maxKwh) * chartHeight;
          const x = 10 + i * (barWidth + gap);
          const y = chartHeight - barHeight;
          const isLast = i === readings.length - 1;

          return (
            <g key={r.month}>
              <rect
                x={x} y={y} width={barWidth} height={barHeight}
                rx="6" ry="6"
                fill={getBarColor(r.kwh)}
                opacity={isLast ? 1 : 0.8}
                className={isLast ? 'meter-pulse' : ''}
              />
              <text
                x={x + barWidth / 2} y={y - 6}
                textAnchor="middle"
                fontSize="10" fontWeight="700" fontFamily="var(--font-mono)"
                fill="var(--text)"
              >
                {r.kwh}
              </text>
              <text
                x={x + barWidth / 2} y={chartHeight + 18}
                textAnchor="middle"
                fontSize="10" fontWeight="700" fontFamily="var(--font-mono)"
                fill="var(--muted)"
              >
                {r.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main Consumer Portal ───────────────────────────────────────────
export default function ConsumerPortal() {
  const {
    consumer, bills, readings, complaints, outstandingBalance,
    currentZoneData, hasOutage,
    payBill, fileComplaint,
  } = useElectricity();

  const [complaintCategory, setComplaintCategory] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');

  const handleFileComplaint = () => {
    if (!complaintCategory || !complaintDesc.trim()) return;
    fileComplaint(complaintCategory, complaintDesc.trim());
    setComplaintCategory('');
    setComplaintDesc('');
  };

  const totalKwh = readings.reduce((s, r) => s + r.kwh, 0);
  const avgKwh = Math.round(totalKwh / readings.length);
  const peakMonth = readings.reduce((max, r) => r.kwh > max.kwh ? r : max, readings[0]);

  return (
    <div>
      {/* Outage Banner */}
      {hasOutage && (
        <div className="outage-banner">
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <strong>POWER OUTAGE ALERT — {currentZoneData?.name}</strong>
            <div style={{ fontSize: '11px', marginTop: '2px' }}>
              {currentZoneData?.activeOutages} feeder(s) affected. Estimated restoration: 2-4 hours.
            </div>
          </div>
        </div>
      )}

      {/* Account Overview + Outage Status */}
      <div className="grid-2">
        <div className="neumorphic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>ACCOUNT OVERVIEW</h3>
            <span className={`badge ${consumer.supplyStatus === 'Connected' ? 'badge-paid' : 'badge-failed'}`}>
              {consumer.supplyStatus.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div><span style={{ color: 'var(--muted)', fontWeight: '700' }}>NAME</span><div style={{ fontWeight: '700', marginTop: '2px' }}>{consumer.name}</div></div>
            <div><span style={{ color: 'var(--muted)', fontWeight: '700' }}>CONSUMER NO.</span><div style={{ fontWeight: '700', marginTop: '2px' }}>{consumer.consumerNo}</div></div>
            <div><span style={{ color: 'var(--muted)', fontWeight: '700' }}>METER NO.</span><div style={{ fontWeight: '700', marginTop: '2px' }}>{consumer.meterNo}</div></div>
            <div><span style={{ color: 'var(--muted)', fontWeight: '700' }}>CONNECTION</span><div style={{ fontWeight: '700', marginTop: '2px' }}>{consumer.connectionType} ({consumer.phase})</div></div>
            <div><span style={{ color: 'var(--muted)', fontWeight: '700' }}>SANCTIONED LOAD</span><div style={{ fontWeight: '700', marginTop: '2px' }}>{consumer.sanctionedLoad} kW</div></div>
            <div><span style={{ color: 'var(--muted)', fontWeight: '700' }}>ZONE</span><div style={{ fontWeight: '700', marginTop: '2px' }}>{currentZoneData?.name || consumer.zone}</div></div>
          </div>

          <div style={{ padding: '12px', background: 'var(--surface)', borderRadius: '10px', boxShadow: 'var(--inset-shadow-sm)', marginTop: '16px', fontSize: '11px', color: 'var(--muted)', lineHeight: '1.5' }}>
            📍 {consumer.address}
          </div>
        </div>

        {/* Current Bill + Outstanding */}
        <div className="neumorphic-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>BILLING SUMMARY</h3>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700' }}>CURRENT MONTH ESTIMATE</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text)', margin: '4px 0' }}>
                ₹{bills[bills.length - 1]?.amount?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {readings[readings.length - 1]?.kwh} kWh consumed
              </div>
            </div>
          </div>

          {outstandingBalance > 0 && (
            <div style={{ padding: '14px', borderRadius: '12px', boxShadow: 'var(--inset-shadow-sm)', background: 'var(--surface)', borderLeft: '5px solid var(--danger)' }}>
              <div style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: '700' }}>TOTAL OUTSTANDING</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--danger)', marginTop: '2px' }}>
                ₹{outstandingBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                {bills.filter(b => b.status !== 'Paid').length} unpaid bill(s)
              </div>
            </div>
          )}

          {outstandingBalance === 0 && (
            <div style={{ padding: '14px', borderRadius: '12px', boxShadow: 'var(--inset-shadow-sm)', background: 'var(--surface)', borderLeft: '5px solid var(--success)' }}>
              <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>✅ ALL BILLS PAID — NO OUTSTANDING DUES</div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Analytics Bar Chart */}
      <div className="neumorphic-card" style={{ marginTop: '4px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>
          MONTHLY CONSUMPTION ANALYTICS
          <span className="meter-pulse-dot" style={{ marginLeft: '8px' }}>●</span>
          <span style={{ fontSize: '10px', color: 'var(--success)', marginLeft: '4px', fontWeight: '400' }}>LIVE FEED</span>
        </h3>

        <UsageBarChart readings={readings} />

        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', textAlign: 'center', fontSize: '12px' }}>
          <div>
            <div style={{ color: 'var(--muted)', fontWeight: '700' }}>AVG / MONTH</div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginTop: '2px' }}>{avgKwh} kWh</div>
          </div>
          <div>
            <div style={{ color: 'var(--muted)', fontWeight: '700' }}>PEAK MONTH</div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginTop: '2px' }}>{peakMonth.month} ({peakMonth.kwh} kWh)</div>
          </div>
          <div>
            <div style={{ color: 'var(--muted)', fontWeight: '700' }}>YTD TOTAL</div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginTop: '2px' }}>{totalKwh.toLocaleString()} kWh</div>
          </div>
        </div>
      </div>

      {/* Bill History Table */}
      <div className="neumorphic-card" style={{ marginTop: '4px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>BILL HISTORY & PAYMENTS</h3>

        <div className="neumorphic-table-container">
          <table className="neumorphic-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Units (kWh)</th>
                <th>Amount (₹)</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...bills].reverse().map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: '700' }}>{b.month}</td>
                  <td>{b.kwh}</td>
                  <td style={{ fontWeight: '700' }}>₹{b.amount.toLocaleString()}{b.lateFee > 0 ? ` + ₹${b.lateFee}` : ''}</td>
                  <td>{b.dueDate}</td>
                  <td>
                    <span className={`badge ${b.status === 'Paid' ? 'badge-paid' : 'badge-failed'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status !== 'Paid' ? (
                      <button className="neumorphic-btn neumorphic-btn-primary" style={{ padding: '6px 14px', fontSize: '11px' }} onClick={() => payBill(b.id)}>
                        Pay ₹{(b.amount + b.lateFee).toLocaleString()}
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Paid {b.paidDate}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Filing + Tracking */}
      <div className="grid-2" style={{ marginTop: '4px' }}>
        {/* File Complaint */}
        <div className="neumorphic-card">
          <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>FILE A COMPLAINT</h3>

          <div className="complaint-form">
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
              <select className="neumorphic-input" value={complaintCategory} onChange={e => setComplaintCategory(e.target.value)}>
                <option value="">Select category...</option>
                {COMPLAINT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
              <textarea
                className="neumorphic-input"
                rows={3}
                placeholder="Describe your issue..."
                value={complaintDesc}
                onChange={e => setComplaintDesc(e.target.value)}
                style={{ resize: 'vertical', minHeight: '70px' }}
              />
            </div>

            <button
              className="neumorphic-btn neumorphic-btn-primary"
              style={{ width: '100%', padding: '12px' }}
              onClick={handleFileComplaint}
              disabled={!complaintCategory || !complaintDesc.trim()}
            >
              📋 Submit Complaint
            </button>
          </div>
        </div>

        {/* Complaint Tracking */}
        <div className="neumorphic-card">
          <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>COMPLAINT TRACKING</h3>

          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: '12px' }}>No complaints filed yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {complaints.map(c => (
                <div key={c.id} style={{ padding: '12px', borderRadius: '10px', boxShadow: 'var(--inset-shadow-sm)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{c.id}</span>
                    <span className={`badge ${c.status === 'Resolved' ? 'badge-paid' : c.status === 'Open' ? 'badge-failed' : 'badge-warning'}`}
                      style={c.status === 'In Progress' ? { color: 'var(--warning)', border: '1px solid rgba(254,153,0,0.2)' } : {}}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontWeight: '700', marginBottom: '2px' }}>{c.category}</div>
                  <div style={{ color: 'var(--text)', lineHeight: '1.4' }}>{c.description}</div>
                  <div style={{ color: 'var(--muted)', marginTop: '4px', fontSize: '10px' }}>Filed: {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
