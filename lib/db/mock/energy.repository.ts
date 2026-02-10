import { IEnergyRepository } from "../repositories";
import {
  EnergyReading,
  EnergyFilters,
  EnergySummary,
  EnergyTarget,
} from "@/types";
import {
  mockEnergyReadings,
  mockEnergyTargets,
  getEnergySummary,
} from "./data/energy";

export const mockEnergyRepository: IEnergyRepository = {
  async getReadings(filters?: EnergyFilters): Promise<EnergyReading[]> {
    let result = [...mockEnergyReadings];
    if (filters?.zone) result = result.filter((r) => r.zone === filters.zone);
    if (filters?.startDate)
      result = result.filter((r) => r.timestamp >= filters.startDate!);
    if (filters?.endDate)
      result = result.filter((r) => r.timestamp <= filters.endDate!);
    return result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  async getSummary(days: number = 1): Promise<EnergySummary> {
    return getEnergySummary(days);
  },

  async getTargets(): Promise<EnergyTarget[]> {
    return mockEnergyTargets;
  },
};
