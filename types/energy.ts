export interface EnergyReading {
  id: string;
  deviceId: string;
  zone: string;
  power_kw: number;
  energy_kwh: number;
  powerFactor: number;
  voltage: number;
  current: number;
  cost: number;
  timestamp: Date;
}

export interface EnergyTarget {
  id: string;
  zone: string;
  targetKwh: number;
  period: "daily" | "weekly" | "monthly";
  startDate: Date;
  endDate: Date;
}

export interface EnergySummary {
  totalKwh: number;
  totalCost: number;
  co2Kg: number;
  vsTarget: number;
  byZone: {
    zone: string;
    kwh: number;
    cost: number;
    percentage: number;
  }[];
  trend: {
    date: string;
    kwh: number;
    cost: number;
  }[];
}

export interface EnergyFilters {
  zone?: string;
  startDate?: Date;
  endDate?: Date;
  period?: "hourly" | "daily" | "weekly" | "monthly";
}
