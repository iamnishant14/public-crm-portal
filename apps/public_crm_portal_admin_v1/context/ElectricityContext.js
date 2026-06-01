import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ZONES, ZONE_STATS, MOCK_CONSUMER, DEFAULT_COMPLAINTS,
  calculateResidentialBill,
} from './electricityData';


const ElectricityContext = createContext();

export const ElectricityProvider = ({ children }) => {
  const [view, setView] = useState('consumer');
  const [consumer, setConsumer] = useState(MOCK_CONSUMER);
  const [bills, setBills] = useState(MOCK_CONSUMER.bills);
  const [readings, setReadings] = useState(MOCK_CONSUMER.readings);
  const [complaints, setComplaints] = useState(DEFAULT_COMPLAINTS);
  const [selectedZone, setSelectedZone] = useState('all');
  const [zoneStats, setZoneStats] = useState(ZONE_STATS);

  // ─── localStorage persistence ────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('electricity_crm_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bills) setBills(parsed.bills);
        if (parsed.readings) setReadings(parsed.readings);
        if (parsed.complaints) setComplaints(parsed.complaints);
        if (parsed.zoneStats) setZoneStats(parsed.zoneStats);
        if (parsed.selectedZone) setSelectedZone(parsed.selectedZone);
      }
    } catch (e) {
      console.warn('Failed to load electricity CRM state', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('electricity_crm_state', JSON.stringify({
        bills, readings, complaints, zoneStats, selectedZone,
      }));
    } catch (e) {
      console.warn('Failed to save electricity CRM state', e);
    }
  }, [bills, readings, complaints, zoneStats, selectedZone]);

  // ─── Background smart meter simulation (every 8s) ────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setReadings(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        const increment = Math.floor(Math.random() * 3) + 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          kwh: updated[lastIdx].kwh + increment,
        };
        return updated;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────

  const payBill = useCallback((billId) => {
    setBills(prev => prev.map(b => {
      if (b.id === billId && (b.status === 'Unpaid' || b.status === 'Overdue')) {
        const today = new Date().toISOString().split('T')[0];
        return { ...b, status: 'Paid', paidDate: today, lateFee: 0 };
      }
      return b;
    }));
  }, []);

  const fileComplaint = useCallback((category, description) => {
    const now = new Date();
    const id = `TKT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(Math.floor(10 + Math.random() * 90))}`;
    const date = now.toISOString().split('T')[0];
    const newComplaint = { id, date, category, description, status: 'Open' };
    setComplaints(prev => [newComplaint, ...prev]);
  }, []);

  const selectZone = useCallback((zoneId) => {
    setSelectedZone(zoneId);
  }, []);

  const simulateOutage = useCallback((zoneId) => {
    setZoneStats(prev => prev.map(z => {
      if (z.id === zoneId) {
        return { ...z, activeOutages: z.activeOutages > 0 ? 0 : Math.floor(1 + Math.random() * 3) };
      }
      return z;
    }));
  }, []);

  const generateNewBill = useCallback(() => {
    const lastReading = readings[readings.length - 1];
    const amount = calculateResidentialBill(lastReading.kwh);
    const now = new Date();
    const newBill = {
      id: `BILL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`,
      month: lastReading.month,
      kwh: lastReading.kwh,
      amount,
      dueDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-15`,
      paidDate: null,
      status: 'Unpaid',
      lateFee: 0,
    };

    setBills(prev => {
      // Avoid duplicate bill for same month
      if (prev.some(b => b.id === newBill.id)) return prev;
      return [...prev, newBill];
    });
  }, [readings]);

  // ─── Derived values ──────────────────────────────────────────────
  const outstandingBalance = bills
    .filter(b => b.status !== 'Paid')
    .reduce((sum, b) => sum + b.amount + b.lateFee, 0);

  const currentZoneData = consumer
    ? zoneStats.find(z => z.id === consumer.zone)
    : null;

  const hasOutage = currentZoneData ? currentZoneData.activeOutages > 0 : false;

  const filteredZoneStats = selectedZone === 'all'
    ? zoneStats
    : zoneStats.filter(z => z.id === selectedZone);

  const totalStats = {
    totalRevenue: zoneStats.reduce((s, z) => s + z.revenue, 0),
    totalOutstanding: zoneStats.reduce((s, z) => s + z.outstandingDues, 0),
    totalConsumers: zoneStats.reduce((s, z) => s + z.consumers, 0),
    totalOutages: zoneStats.reduce((s, z) => s + z.activeOutages, 0),
    avgAtcLoss: zoneStats.reduce((s, z) => s + z.atcLoss, 0) / zoneStats.length,
    avgCollectionRate: zoneStats.reduce((s, z) => s + z.collectionRate, 0) / zoneStats.length,
  };

  return (
    <ElectricityContext.Provider value={{
      view, setView,
      consumer,
      bills, readings, complaints,
      selectedZone, zoneStats, filteredZoneStats, totalStats,
      outstandingBalance, currentZoneData, hasOutage,
      payBill, fileComplaint, selectZone, simulateOutage, generateNewBill,
    }}>
      {children}
    </ElectricityContext.Provider>
  );
};

export const useElectricity = () => {
  const ctx = useContext(ElectricityContext);
  if (!ctx) throw new Error('useElectricity must be used within ElectricityProvider');
  return ctx;
};
