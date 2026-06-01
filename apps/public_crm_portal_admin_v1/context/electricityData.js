// ─── Zone / District Definitions ──────────────────────────────────────
export const ZONES = [
  { id: 'ranchi',       name: 'Ranchi',                consumers: 284500, area: 'Urban' },
  { id: 'jamshedpur',   name: 'Jamshedpur (E. Singhbhum)', consumers: 198200, area: 'Urban' },
  { id: 'dhanbad',      name: 'Dhanbad',               consumers: 176400, area: 'Urban' },
  { id: 'bokaro',       name: 'Bokaro',                consumers: 142800, area: 'Urban' },
  { id: 'hazaribagh',   name: 'Hazaribagh',            consumers: 98700,  area: 'Semi-Urban' },
  { id: 'deoghar',      name: 'Deoghar',               consumers: 87300,  area: 'Semi-Urban' },
  { id: 'giridih',      name: 'Giridih',               consumers: 79500,  area: 'Semi-Urban' },
  { id: 'dumka',        name: 'Dumka',                  consumers: 64200,  area: 'Rural' },
  { id: 'palamu',       name: 'Palamu',                 consumers: 58900,  area: 'Rural' },
  { id: 'garhwa',       name: 'Garhwa',                 consumers: 52100,  area: 'Rural' },
  { id: 'chaibasa',     name: 'Chaibasa (W. Singhbhum)', consumers: 48700, area: 'Rural' },
  { id: 'ramgarh',      name: 'Ramgarh',                consumers: 67800,  area: 'Semi-Urban' },
  { id: 'koderma',      name: 'Koderma',                consumers: 43200,  area: 'Rural' },
  { id: 'chatra',       name: 'Chatra',                 consumers: 38500,  area: 'Rural' },
  { id: 'latehar',      name: 'Latehar',                consumers: 31200,  area: 'Rural' },
];

// ─── Tariff Slabs ─────────────────────────────────────────────────────
export const TARIFF = {
  Residential: {
    slabs: [
      { upTo: 100,  rate: 3.50 },  // 0-100 kWh
      { upTo: 300,  rate: 5.50 },  // 101-300 kWh
      { upTo: Infinity, rate: 7.50 },  // 300+ kWh
    ],
    fixedCharge: 50,  // ₹/month
  },
  Commercial: {
    flatRate: 8.00,
    demandCharge: 200,  // ₹/kW/month
    fixedCharge: 100,
  },
  Industrial: {
    flatRate: 6.50,
    demandCharge: 250,
    powerFactorSurcharge: 0.02,  // 2% if PF < 0.9
    fixedCharge: 200,
  },
};

// ─── Consumer Categories ──────────────────────────────────────────────
export const CONSUMER_CATEGORIES = [
  { type: 'Residential', pct: 72, avgMonthlyKwh: 180, icon: '🏠' },
  { type: 'Commercial',  pct: 18, avgMonthlyKwh: 850, icon: '🏪' },
  { type: 'Industrial',  pct: 10, avgMonthlyKwh: 4200, icon: '🏭' },
];

// ─── Calculate bill for residential consumer ──────────────────────────
export function calculateResidentialBill(kWh) {
  let total = TARIFF.Residential.fixedCharge;
  let remaining = kWh;
  let prevLimit = 0;

  for (const slab of TARIFF.Residential.slabs) {
    const slabUnits = Math.min(remaining, slab.upTo - prevLimit);
    if (slabUnits <= 0) break;
    total += slabUnits * slab.rate;
    remaining -= slabUnits;
    prevLimit = slab.upTo;
  }

  return Math.round(total);
}

// ─── Monthly readings (realistic seasonal pattern) ────────────────────
const MONTH_NAMES = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

// Base consumption with seasonal multipliers (summer peak Jun-Aug)
const SEASONAL_MULTIPLIER = [0.85, 1.0, 1.35, 1.40, 1.30, 1.05, 0.80, 0.70, 0.65, 0.75, 0.70, 0.80];

// A simple seeded random generator for determinism across server (SSR) and client
function makeRandom(seed) {
  let s = seed;
  return function() {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

function generateMonthlyReadings(baseKwh) {
  const random = makeRandom(1);
  return MONTH_NAMES.map((month, i) => {
    const jitter = 0.9 + random() * 0.2; // ±10% random variance
    const kwh = Math.round(baseKwh * SEASONAL_MULTIPLIER[i] * jitter);
    return { month, kwh };
  });
}

function generateBills(readings) {
  const random = makeRandom(2);
  const today = new Date("2026-06-01");
  const currentMonthIndex = today.getMonth(); // 0-11

  return readings.map((r, i) => {
    const amount = calculateResidentialBill(r.kwh);
    const billYear = i < 9 ? 2025 : 2026;
    const billMonth = ((3 + i) % 12) + 1; // Apr=4, May=5 ... Mar=3
    const dueDate = `${billYear}-${String(billMonth).padStart(2, '0')}-15`;

    // Determine status: last 2 months might be unpaid
    let status = 'Paid';
    let paidDate = `${billYear}-${String(billMonth).padStart(2, '0')}-${Math.floor(5 + random() * 8).toString().padStart(2, '0')}`;

    if (i === readings.length - 1) {
      status = 'Unpaid';
      paidDate = null;
    } else if (i === readings.length - 2) {
      // 50% chance of being overdue
      if (random() > 0.5) {
        status = 'Overdue';
        paidDate = null;
      }
    }

    return {
      id: `BILL-${billYear}${String(billMonth).padStart(2, '0')}`,
      month: r.month,
      kwh: r.kwh,
      amount,
      dueDate,
      paidDate,
      status,
      lateFee: status === 'Overdue' ? Math.round(amount * 0.02) : 0,
    };
  });
}

// ─── Mock Consumer Profile ────────────────────────────────────────────
const readings = generateMonthlyReadings(175);
const bills = generateBills(readings);

export const MOCK_CONSUMER = {
  name: 'Rajesh Kumar Sharma',
  consumerNo: '3104587926',
  meterNo: 'MTR-JH-RNC-04521',
  connectionType: 'Residential',
  sanctionedLoad: 3, // kW
  phase: 'Single Phase',
  zone: 'ranchi',
  address: '42, Lalpur Colony, Main Road, Ranchi - 834001',
  supplyStatus: 'Connected',
  readings,
  bills,
};

// ─── Zone Aggregate Statistics (for Employee Dashboard) ───────────────
function generateZoneStats() {
  const random = makeRandom(3);
  return ZONES.map(zone => {
    const baseRevenue = (zone.consumers * 0.0008) + random() * 2;
    const collectionRate = 72 + random() * 26; // 72-98%
    const atcLoss = zone.area === 'Urban' ? (8 + random() * 10) : (15 + random() * 20);
    const outstandingDues = baseRevenue * (1 - collectionRate / 100) * 3;

    return {
      ...zone,
      revenue: Math.round(baseRevenue * 100) / 100,         // ₹ Cr
      collectionRate: Math.round(collectionRate * 10) / 10,  // %
      atcLoss: Math.round(atcLoss * 10) / 10,               // %
      outstandingDues: Math.round(outstandingDues * 100) / 100, // ₹ Cr
      activeOutages: Math.floor(random() * 4),
      pendingComplaints: Math.floor(10 + random() * 80),
      residential: Math.round(zone.consumers * 0.72),
      commercial: Math.round(zone.consumers * 0.18),
      industrial: Math.round(zone.consumers * 0.10),
    };
  });
}

export const ZONE_STATS = generateZoneStats();

// ─── Default complaints ───────────────────────────────────────────────
export const DEFAULT_COMPLAINTS = [
  { id: 'TKT-20260401', date: '2026-04-12', category: 'Billing Dispute', description: 'April bill seems higher than expected usage', status: 'Resolved' },
  { id: 'TKT-20260502', date: '2026-05-18', category: 'Meter Issue', description: 'Meter display is flickering intermittently', status: 'In Progress' },
];

export const COMPLAINT_CATEGORIES = [
  'Billing Dispute',
  'Meter Issue',
  'Power Outage',
  'New Connection',
  'Load Change',
  'Voltage Fluctuation',
  'Other',
];
