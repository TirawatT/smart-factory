export interface EnergyLog {
  readonly id: string;
  readonly deviceId: string;
  readonly deviceName: string;
  readonly consumption: number;
  readonly unit: string;
  readonly cost: number;
  readonly period: "hourly" | "daily" | "weekly" | "monthly";
  readonly timestamp: Date;
}

export interface EnergyStats {
  readonly totalConsumption: number;
  readonly totalCost: number;
  readonly averageEfficiency: number;
  readonly peakDemand: number;
  readonly unit: string;
}

export interface EnergyByZone {
  readonly zone: string;
  readonly consumption: number;
  readonly cost: number;
  readonly deviceCount: number;
}

export interface EnergyTrend {
  readonly date: string;
  readonly consumption: number;
  readonly cost: number;
  readonly target: number;
}

export interface EnergySuggestion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly potentialSaving: number;
  readonly priority: "high" | "medium" | "low";
  readonly deviceId?: string;
  readonly deviceName?: string;
}
