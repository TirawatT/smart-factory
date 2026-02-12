import type {
  EnergyByZone,
  EnergyLog,
  EnergyStats,
  EnergySuggestion,
  EnergyTrend,
} from "@/types";

// Generate 24-hour energy data for today
function generateHourlyData(): EnergyLog[] {
  const data: EnergyLog[] = [];
  const devices = [
    { id: "dev-003", name: "Motor Controller C1", baseConsumption: 8 },
    { id: "dev-005", name: "Energy Meter E1", baseConsumption: 25 },
    { id: "dev-006", name: "Conveyor Motor A2", baseConsumption: 12 },
    { id: "dev-012", name: "Robotic Arm A3", baseConsumption: 15 },
  ];

  devices.forEach((device) => {
    for (let h = 0; h < 24; h++) {
      const variation = 0.7 + Math.random() * 0.6; // 70-130% of base
      const isWorkHour = h >= 6 && h <= 22;
      const multiplier = isWorkHour ? variation : variation * 0.3;
      const consumption = device.baseConsumption * multiplier;

      data.push({
        id: `energy-${device.id}-${h}`,
        deviceId: device.id,
        deviceName: device.name,
        consumption: Math.round(consumption * 100) / 100,
        unit: "kWh",
        cost: Math.round(consumption * 4.5 * 100) / 100, // 4.5 THB per kWh
        period: "hourly",
        timestamp: new Date(2026, 1, 12, h, 0, 0),
      });
    }
  });

  return data;
}

export const mockEnergyLogs: EnergyLog[] = generateHourlyData();

export const mockEnergyStats: EnergyStats = {
  totalConsumption: 1842.5,
  totalCost: 8291.25,
  averageEfficiency: 87.5,
  peakDemand: 68.3,
  unit: "kWh",
};

export const mockEnergyByZone: EnergyByZone[] = [
  {
    zone: "Production Line 1",
    consumption: 720.5,
    cost: 3242.25,
    deviceCount: 4,
  },
  {
    zone: "Production Line 2",
    consumption: 380.2,
    cost: 1710.9,
    deviceCount: 2,
  },
  { zone: "Assembly Line", consumption: 445.8, cost: 2006.1, deviceCount: 1 },
  { zone: "Utilities", consumption: 196.0, cost: 882.0, deviceCount: 3 },
  { zone: "Warehouse", consumption: 55.0, cost: 247.5, deviceCount: 1 },
  { zone: "Infrastructure", consumption: 45.0, cost: 202.5, deviceCount: 1 },
];

export const mockEnergyTrends: EnergyTrend[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date(2026, 0, 14 + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const base = isWeekend ? 800 : 1800;
    const variation = base * (0.85 + Math.random() * 0.3);

    return {
      date: date.toISOString().split("T")[0],
      consumption: Math.round(variation * 10) / 10,
      cost: Math.round(variation * 4.5 * 10) / 10,
      target: isWeekend ? 900 : 1700,
    };
  },
);

export const mockEnergySuggestions: EnergySuggestion[] = [
  {
    id: "sug-001",
    title: "ลดความเร็วมอเตอร์ในช่วง Off-Peak",
    description:
      "Motor Controller C1 ทำงานที่ความเร็วสูงในช่วง 22:00-06:00 ซึ่งไม่จำเป็น สามารถลดเหลือ 50% ได้",
    potentialSaving: 15.5,
    priority: "high",
    deviceId: "dev-003",
    deviceName: "Motor Controller C1",
  },
  {
    id: "sug-002",
    title: "ซ่อมบำรุง Conveyor Motor A2",
    description:
      "อุณหภูมิสูงผิดปกติ อาจเกิดจากแบริ่งเสื่อม ทำให้ใช้พลังงานมากขึ้น 20%",
    potentialSaving: 22.0,
    priority: "high",
    deviceId: "dev-006",
    deviceName: "Conveyor Motor A2",
  },
  {
    id: "sug-003",
    title: "ปรับ Power Factor ของระบบ",
    description:
      "Power Factor อยู่ที่ 0.92 — การติดตั้ง Capacitor Bank สามารถปรับเป็น 0.98 ได้",
    potentialSaving: 8.0,
    priority: "medium",
    deviceId: "dev-005",
    deviceName: "Energy Meter E1",
  },
  {
    id: "sug-004",
    title: "ปิดอุปกรณ์ในคลังสินค้าช่วงกลางคืน",
    description:
      "Temperature Sensor B3 ไม่จำเป็นต้องทำงาน 24 ชม. สามารถตั้ง schedule ปิดช่วง 22:00-06:00",
    potentialSaving: 3.2,
    priority: "low",
    deviceId: "dev-011",
    deviceName: "Temperature Sensor B3",
  },
];
