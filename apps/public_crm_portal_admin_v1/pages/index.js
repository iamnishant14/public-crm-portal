import React from 'react';
import Head from 'next/head';
import { ElectricityProvider, useElectricity } from '../context/ElectricityContext';
import ConsumerPortal from '../components/ConsumerPortal';
import EmployeeDashboard from '../components/EmployeeDashboard';

function ElectricityCRMContent() {
  const { view, setView, consumer, hasOutage, selectedZone } = useElectricity();

  return (
    <>
      <Head>
        <title>Jharkhand Vidyut Vitran — Consumer & Operations Portal</title>
        <meta name="description" content="Official Electricity Department CRM Portal for Jharkhand. Consumer self-service for billing, usage analytics, complaints, and outage tracking. Employee zone-wise operational dashboard with 15-district analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </Head>

      {/* Application Header */}
      <header className="app-header">
        <div className="brand" id="brand-logo">
          <span style={{ fontSize: '24px' }}>⚡</span>
          <span style={{ letterSpacing: '0.05em' }}>JHARKHAND VIDYUT VITRAN</span>
        </div>

        {/* Consumer / Employee Mode Toggle */}
        <div className="switch-container" id="view-mode-switcher">
          <button
            id="switch-btn-consumer"
            className={`switch-btn ${view === 'consumer' ? 'active' : ''}`}
            onClick={() => setView('consumer')}
          >
            🏠 Consumer Portal
          </button>
          <button
            id="switch-btn-employee"
            className={`switch-btn ${view === 'employee' ? 'active' : ''}`}
            onClick={() => setView('employee')}
          >
            🏢 Employee Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-container">

        {/* Page Title */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {view === 'consumer'
              ? 'Consumer Self-Service Portal'
              : 'District Operations & Analytics'}
          </h1>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)', fontWeight: '700' }}>
            {view === 'consumer' ? (
              <>
                CONSUMER: <span style={{ color: 'var(--primary)' }}>{consumer.consumerNo}</span> | 
                STATUS: <span style={{ color: consumer.supplyStatus === 'Connected' ? 'var(--success)' : 'var(--danger)' }}>{consumer.supplyStatus.toUpperCase()}</span>
                {hasOutage && <span style={{ color: 'var(--danger)', marginLeft: '8px' }}>⚠ OUTAGE ACTIVE</span>}
              </>
            ) : (
              <>
                ZONE: <span style={{ color: 'var(--primary)' }}>{selectedZone === 'all' ? 'ALL DISTRICTS' : selectedZone.toUpperCase()}</span> |
                DISTRICTS: <span style={{ color: 'var(--primary)' }}>15</span> |
                STATE: <span style={{ color: 'var(--success)' }}>JHARKHAND</span>
              </>
            )}
          </p>
        </div>

        {/* Dynamic Portal */}
        {view === 'consumer' ? <ConsumerPortal /> : <EmployeeDashboard />}

        {/* Footer */}
        <footer style={{ marginTop: '60px', borderTop: '2px solid #dcdad9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          <div>
            &copy; 2026 JHARKHAND VIDYUT VITRAN NIGAM LTD. POWERED BY NEXT.JS.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>THEME: NEUMORPHISM</span>
            <span>PORTAL: CRM V2</span>
          </div>
        </footer>

      </main>
    </>
  );
}

export default function Home() {
  return (
    <ElectricityProvider>
      <ElectricityCRMContent />
    </ElectricityProvider>
  );
}
