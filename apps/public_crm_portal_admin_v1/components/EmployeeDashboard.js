import React, { useState } from 'react';
import { useElectricity } from '../context/ElectricityContext';
import { ZONES, CONSUMER_CATEGORIES } from '../context/electricityData';

// ─── Progress Ring (reused from earlier) ────────────────────────────
function ProgressRing({ value, max, label, color }) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const radius = 36;
  const stroke = 6;
  const r = radius - stroke * 2;
  const circumference = r * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle className="progress-ring-bg" strokeWidth={stroke} r={r} cx={radius} cy={radius} />
        <circle className="progress-ring-bar" stroke={color || 'var(--primary)'} strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset: offset }}
          r={r} cx={radius} cy={radius} />
        <text className="progress-ring-text" x="50%" y="54%" fontSize="12">{percent}%</text>
      </svg>
      <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '700', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

// ─── Main Employee Dashboard ────────────────────────────────────────
export default function EmployeeDashboard() {
  const {
    selectedZone, zoneStats, filteredZoneStats, totalStats,
    selectZone, simulateOutage, generateNewBill,
  } = useElectricity();

  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) { setSortAsc(!sortAsc); }
    else { setSortField(field); setSortAsc(true); }
  };

  const sortedZones = [...zoneStats].sort((a, b) => {
    if (!sortField) return 0;
    const va = a[sortField];
    const vb = b[sortField];
    return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const displayStats = selectedZone === 'all' ? totalStats : (() => {
    const z = zoneStats.find(z => z.id === selectedZone);
    return z ? {
      totalRevenue: z.revenue,
      totalOutstanding: z.outstandingDues,
      totalConsumers: z.consumers,
      totalOutages: z.activeOutages,
      avgAtcLoss: z.atcLoss,
      avgCollectionRate: z.collectionRate,
    } : totalStats;
  })();

  const sortIcon = (field) => sortField === field ? (sortAsc ? ' ▲' : ' ▼') : '';

  return (
    <div>
      {/* Zone Selector */}
      <div className="neumorphic-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', whiteSpace: 'nowrap' }}>🗺️ SELECT ZONE</label>
          <select className="neumorphic-input" style={{ width: '280px' }} value={selectedZone} onChange={e => selectZone(e.target.value)}>
            <option value="all">All Zones — State Overview ({ZONES.length} Districts)</option>
            {ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
          Viewing: <strong style={{ color: 'var(--primary)' }}>{selectedZone === 'all' ? 'ALL ZONES' : ZONES.find(z => z.id === selectedZone)?.name.toUpperCase()}</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-card-grid">
        <div className="neumorphic-card">
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', letterSpacing: '0.05em' }}>REVENUE COLLECTED</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--primary)', margin: '6px 0' }}>
            ₹{displayStats.totalRevenue.toFixed(2)} Cr
          </div>
          <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
            Collection Rate: {displayStats.avgCollectionRate.toFixed(1)}%
          </div>
        </div>

        <div className="neumorphic-card">
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', letterSpacing: '0.05em' }}>OUTSTANDING DUES</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--danger)', margin: '6px 0' }}>
            ₹{displayStats.totalOutstanding.toFixed(2)} Cr
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            {selectedZone === 'all' ? `${ZONES.length} zones` : '1 zone'}
          </div>
        </div>

        <div className="neumorphic-card">
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', letterSpacing: '0.05em' }}>AT&C LOSSES</div>
          <div style={{ fontSize: '26px', fontWeight: '700', margin: '6px 0',
            color: displayStats.avgAtcLoss > 25 ? 'var(--danger)' : displayStats.avgAtcLoss > 15 ? 'var(--warning)' : 'var(--success)' }}>
            {displayStats.avgAtcLoss.toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            Target: {'<'}15%
          </div>
        </div>

        <div className="neumorphic-card">
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', letterSpacing: '0.05em' }}>ACTIVE OUTAGES</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: displayStats.totalOutages > 0 ? 'var(--danger)' : 'var(--success)', margin: '6px 0' }}>
            {displayStats.totalOutages}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            {displayStats.totalConsumers.toLocaleString()} total consumers
          </div>
        </div>
      </div>

      {/* Zone Comparison Table (All Zones view) */}
      {selectedZone === 'all' && (
        <div className="neumorphic-card" style={{ marginTop: '4px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>ZONE-WISE COMPARISON — {ZONES.length} DISTRICTS</h3>

          <div className="neumorphic-table-container">
            <table className="neumorphic-table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Zone{sortIcon('name')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('consumers')}>Consumers{sortIcon('consumers')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('revenue')}>Revenue (₹ Cr){sortIcon('revenue')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('collectionRate')}>Collection %{sortIcon('collectionRate')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('atcLoss')}>AT&C Loss %{sortIcon('atcLoss')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('pendingComplaints')}>Complaints{sortIcon('pendingComplaints')}</th>
                  <th>Outages</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedZones.map(z => (
                  <tr key={z.id} className="zone-table-row-clickable" onClick={() => selectZone(z.id)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: '700' }}>{z.name}</td>
                    <td>{z.consumers.toLocaleString()}</td>
                    <td style={{ fontWeight: '700' }}>₹{z.revenue.toFixed(2)}</td>
                    <td>
                      <span style={{ fontWeight: '700', color: z.collectionRate < 80 ? 'var(--danger)' : z.collectionRate > 95 ? 'var(--success)' : 'var(--text)' }}>
                        {z.collectionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: z.atcLoss > 25 ? 'var(--danger)' : z.atcLoss > 15 ? 'var(--warning)' : 'var(--success)' }}>
                        {z.atcLoss.toFixed(1)}%
                      </span>
                    </td>
                    <td>{z.pendingComplaints}</td>
                    <td>
                      {z.activeOutages > 0 ? (
                        <span className="badge badge-failed">{z.activeOutages} ACTIVE</span>
                      ) : (
                        <span className="badge badge-paid">NORMAL</span>
                      )}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="neumorphic-btn" style={{ padding: '4px 10px', fontSize: '10px' }}
                        onClick={() => simulateOutage(z.id)}>
                        {z.activeOutages > 0 ? '✅ Restore' : '⚡ Outage'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Single Zone Detail View */}
      {selectedZone !== 'all' && (() => {
        const z = zoneStats.find(z => z.id === selectedZone);
        if (!z) return null;

        return (
          <>
            {/* Consumer Category Breakdown */}
            <div className="neumorphic-card" style={{ marginTop: '4px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>
                CONSUMER CATEGORY BREAKDOWN — {z.name.toUpperCase()}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {CONSUMER_CATEGORIES.map(cat => {
                  const count = cat.type === 'Residential' ? z.residential :
                    cat.type === 'Commercial' ? z.commercial : z.industrial;
                  return (
                    <div key={cat.type} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                      <ProgressRing value={cat.pct} max={100} label={cat.type} color={
                        cat.type === 'Residential' ? 'var(--primary)' :
                          cat.type === 'Commercial' ? 'var(--warning)' : 'var(--danger)'
                      } />
                      <div style={{ marginTop: '8px', fontWeight: '700', fontSize: '14px' }}>{count.toLocaleString()}</div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Avg {cat.avgMonthlyKwh} kWh/mo</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zone Operations */}
            <div className="grid-2" style={{ marginTop: '4px' }}>
              <div className="neumorphic-card">
                <h3 style={{ margin: '0 0 12px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>ZONE OPERATIONS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '14px', borderRadius: '10px', boxShadow: 'var(--inset-shadow-sm)', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--muted)', fontSize: '11px' }}>SUPPLY STATUS</div>
                      <div style={{ fontWeight: '700', marginTop: '2px', color: z.activeOutages > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {z.activeOutages > 0 ? `⚠️ ${z.activeOutages} Outage(s) Active` : '✅ All Feeders Normal'}
                      </div>
                    </div>
                    <button className={`neumorphic-btn ${z.activeOutages > 0 ? 'neumorphic-btn-success' : 'neumorphic-btn-danger'}`}
                      style={{ padding: '8px 16px', fontSize: '11px' }}
                      onClick={() => simulateOutage(z.id)}>
                      {z.activeOutages > 0 ? '✅ Restore Supply' : '⚡ Simulate Outage'}
                    </button>
                  </div>

                  <button className="neumorphic-btn neumorphic-btn-primary" style={{ width: '100%', padding: '12px' }} onClick={generateNewBill}>
                    📄 Generate Monthly Bills
                  </button>
                </div>
              </div>

              <div className="neumorphic-card">
                <h3 style={{ margin: '0 0 12px 0', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>COMPLAINT SUMMARY</h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--danger)' }}>{Math.floor(z.pendingComplaints * 0.4)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '700' }}>OPEN</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--warning)' }}>{Math.floor(z.pendingComplaints * 0.35)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '700' }}>IN PROGRESS</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>{Math.floor(z.pendingComplaints * 0.25)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '700' }}>RESOLVED</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
