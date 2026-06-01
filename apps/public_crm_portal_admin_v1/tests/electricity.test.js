const {
  ZONES, ZONE_STATS, TARIFF, CONSUMER_CATEGORIES, MOCK_CONSUMER,
  calculateResidentialBill, DEFAULT_COMPLAINTS, COMPLAINT_CATEGORIES,
} = require('../context/electricityData');

// ─── Zone Data Integrity ──────────────────────────────────────────────
describe('Zone Data Integrity', () => {
  test('should have exactly 15 zones', () => {
    expect(ZONES.length).toBe(15);
  });

  test('every zone has required fields', () => {
    ZONES.forEach(z => {
      expect(z.id).toBeTruthy();
      expect(z.name).toBeTruthy();
      expect(typeof z.consumers).toBe('number');
      expect(z.consumers).toBeGreaterThan(0);
      expect(['Urban', 'Semi-Urban', 'Rural']).toContain(z.area);
    });
  });

  test('zone IDs are unique', () => {
    const ids = ZONES.map(z => z.id);
    expect(new Set(ids).size).toBe(ZONES.length);
  });

  test('zone stats match zone count', () => {
    expect(ZONE_STATS.length).toBe(ZONES.length);
    ZONE_STATS.forEach(z => {
      expect(z.revenue).toBeGreaterThan(0);
      expect(z.collectionRate).toBeGreaterThan(0);
      expect(z.collectionRate).toBeLessThanOrEqual(100);
      expect(z.atcLoss).toBeGreaterThan(0);
    });
  });
});

// ─── Tariff Calculations ──────────────────────────────────────────────
describe('Residential Tariff Calculation', () => {
  test('50 kWh → only first slab (50 × 3.50) + fixed ₹50', () => {
    const bill = calculateResidentialBill(50);
    expect(bill).toBe(50 + 50 * 3.50); // 50 + 175 = 225
  });

  test('100 kWh → first slab maxed (100 × 3.50) + fixed ₹50', () => {
    const bill = calculateResidentialBill(100);
    expect(bill).toBe(50 + 100 * 3.50); // 50 + 350 = 400
  });

  test('150 kWh → (100 × 3.50) + (50 × 5.50) + fixed ₹50', () => {
    const bill = calculateResidentialBill(150);
    // 50 + 350 + 275 = 675
    expect(bill).toBe(50 + 350 + 275);
  });

  test('300 kWh → (100 × 3.50) + (200 × 5.50) + fixed ₹50', () => {
    const bill = calculateResidentialBill(300);
    // 50 + 350 + 1100 = 1500
    expect(bill).toBe(50 + 350 + 1100);
  });

  test('400 kWh → (100 × 3.50) + (200 × 5.50) + (100 × 7.50) + fixed ₹50', () => {
    const bill = calculateResidentialBill(400);
    // 50 + 350 + 1100 + 750 = 2250
    expect(bill).toBe(50 + 350 + 1100 + 750);
  });

  test('0 kWh → only fixed charge ₹50', () => {
    const bill = calculateResidentialBill(0);
    expect(bill).toBe(50);
  });
});

// ─── Consumer Profile ─────────────────────────────────────────────────
describe('Mock Consumer Profile', () => {
  test('has 12 monthly readings', () => {
    expect(MOCK_CONSUMER.readings.length).toBe(12);
  });

  test('has 12 bills', () => {
    expect(MOCK_CONSUMER.bills.length).toBe(12);
  });

  test('consumer is in a valid zone', () => {
    const zoneIds = ZONES.map(z => z.id);
    expect(zoneIds).toContain(MOCK_CONSUMER.zone);
  });

  test('connection type is Residential', () => {
    expect(MOCK_CONSUMER.connectionType).toBe('Residential');
  });

  test('all readings have positive kWh', () => {
    MOCK_CONSUMER.readings.forEach(r => {
      expect(r.kwh).toBeGreaterThan(0);
    });
  });

  test('bill amounts correspond to readings', () => {
    MOCK_CONSUMER.bills.forEach((b, i) => {
      const expected = calculateResidentialBill(b.kwh);
      expect(b.amount).toBe(expected);
    });
  });
});

// ─── Complaint System ─────────────────────────────────────────────────
describe('Complaint System', () => {
  test('default complaints have required fields', () => {
    DEFAULT_COMPLAINTS.forEach(c => {
      expect(c.id).toBeTruthy();
      expect(c.date).toBeTruthy();
      expect(c.category).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(['Open', 'In Progress', 'Resolved']).toContain(c.status);
    });
  });

  test('complaint categories list is non-empty', () => {
    expect(COMPLAINT_CATEGORIES.length).toBeGreaterThan(0);
  });
});

// ─── Consumer Categories ──────────────────────────────────────────────
describe('Consumer Categories', () => {
  test('three categories exist', () => {
    expect(CONSUMER_CATEGORIES.length).toBe(3);
  });

  test('percentages sum to 100', () => {
    const total = CONSUMER_CATEGORIES.reduce((s, c) => s + c.pct, 0);
    expect(total).toBe(100);
  });
});
