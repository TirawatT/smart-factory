import { EnergyReading, EnergyTarget, EnergySummary } from "@/types";

const RATE_PER_KWH = 4.15; // THB per kWh
const CO2_PER_KWH = 0.45; // kg CO₂ per kWh

function generateEnergyReadings(): EnergyReading[] {
  const readings: EnergyReading[] = [];
  const zones = ["zone-a", "zone-b", "zone-c", "zone-d"];
  const zoneDevices: Record<string, string> = {
    "zone-a": "dev_013",
    "zone-b": "dev_014",
    "zone-c": "dev_006",
    "zone-d": "dev_015",
  };

  // Base power per zone (kW)
  const basePower: Record<string, number> = {
    "zone-a": 120,
    "zone-b": 80,
    "zone-c": 45,
    "zone-d": 35,
  };

  // Generate hourly readings for 30 days
  for (let day = 0; day < 30; day++) {
    for (let hour = 0; hour < 24; hour++) {
      for (const zone of zones) {
        const date = new Date("2026-02-10T00:00:00");
        date.setDate(date.getDate() - day);
        date.setHours(hour);

        // Simulate day/night cycle: higher during work hours (6-22)
        const isWorkHours = hour >= 6 && hour <= 22;
        const timeFactor = isWorkHours ? 1.0 : 0.3;
        // Weekend factor (Sat/Sun lower)
        const dayOfWeek = date.getDay();
        const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.5 : 1.0;

        const base = basePower[zone];
        const power =
          base * timeFactor * weekendFactor * (0.85 + Math.random() * 0.3);
        const energy = power * 1; // 1 hour
        const voltage = 380 + (Math.random() * 20 - 10);
        const current = (power * 1000) / (Math.sqrt(3) * voltage * 0.9);
        const pf = 0.85 + Math.random() * 0.1;

        readings.push({
          id: `energy_${zone}_d${day}_h${hour}`,
          deviceId: zoneDevices[zone],
          zone,
          power_kw: Math.round(power * 100) / 100,
          energy_kwh: Math.round(energy * 100) / 100,
          powerFactor: Math.round(pf * 1000) / 1000,
          voltage: Math.round(voltage * 10) / 10,
          current: Math.round(current * 10) / 10,
          cost: Math.round(energy * RATE_PER_KWH * 100) / 100,
          timestamp: new Date(date),
        });
      }
    }
  }

  return readings;
}

export const mockEnergyReadings: EnergyReading[] = generateEnergyReadings();

export const mockEnergyTargets: EnergyTarget[] = [
  {
    id: "target_001",
    zone: "zone-a",
    targetKwh: 2800,
    period: "daily",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
  },
  {
    id: "target_002",
    zone: "zone-b",
    targetKwh: 1900,
    period: "daily",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
  },
  {
    id: "target_003",
    zone: "zone-c",
    targetKwh: 1000,
    period: "daily",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
  },
  {
    id: "target_004",
    zone: "zone-d",
    targetKwh: 800,
    period: "daily",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
  },
];

export function getEnergySummary(days: number = 1): EnergySummary {
  const cutoff = new Date("2026-02-10T00:00:00");
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = mockEnergyReadings.filter((r) => r.timestamp >= cutoff);
  const zones = ["zone-a", "zone-b", "zone-c", "zone-d"];

  const totalKwh = filtered.reduce((sum, r) => sum + r.energy_kwh, 0);
  const totalCost = totalKwh * RATE_PER_KWH;
  const co2Kg = totalKwh * CO2_PER_KWH;

  const dailyTarget = mockEnergyTargets.reduce(
    (sum, t) => sum + t.targetKwh,
    0,
  );
  const vsTarget = (totalKwh / (dailyTarget * days)) * 100 - 100;

  const byZone = zones.map((zone) => {
    const zoneData = filtered.filter((r) => r.zone === zone);
    const kwh = zoneData.reduce((sum, r) => sum + r.energy_kwh, 0);
    return {
      zone,
      kwh: Math.round(kwh),
      cost: Math.round(kwh * RATE_PER_KWH),
      percentage: Math.round((kwh / totalKwh) * 100),
    };
  });

  // Daily trend for last 7 days
  const trend: { date: string; kwh: number; cost: number }[] = [];
  for (let d = 6; d >= 0; d--) {
    const dayStart = new Date("2026-02-10T00:00:00");
    dayStart.setDate(dayStart.getDate() - d);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayData = mockEnergyReadings.filter(
      (r) => r.timestamp >= dayStart && r.timestamp < dayEnd,
    );
    const dayKwh = dayData.reduce((sum, r) => sum + r.energy_kwh, 0);
    trend.push({
      date: dayStart.toISOString().split("T")[0],
      kwh: Math.round(dayKwh),
      cost: Math.round(dayKwh * RATE_PER_KWH),
    });
  }

  return {
    totalKwh: Math.round(totalKwh),
    totalCost: Math.round(totalCost),
    co2Kg: Math.round(co2Kg),
    vsTarget: Math.round(vsTarget * 10) / 10,
    byZone,
    trend,
  };
}
