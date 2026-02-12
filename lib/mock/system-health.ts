import type { SystemHealthOverview } from "@/types";

export const mockSystemHealth: SystemHealthOverview = {
  api: {
    service: "API Server",
    status: "healthy",
    latency: 45,
    uptime: 99.98,
    lastCheck: new Date("2026-02-12T09:00:00Z"),
    details: { requestsPerMinute: 1250, errorRate: 0.02 },
  },
  database: {
    service: "PostgreSQL",
    status: "healthy",
    latency: 12,
    uptime: 99.99,
    lastCheck: new Date("2026-02-12T09:00:00Z"),
    details: { connectionPool: 15, maxConnections: 100, queryPerSecond: 340 },
  },
  mqttBroker: {
    service: "MQTT Broker (HiveMQ)",
    status: "healthy",
    latency: 28,
    uptime: 99.95,
    lastCheck: new Date("2026-02-12T09:00:00Z"),
    details: { connectedClients: 12, messagesPerSecond: 250, topicCount: 48 },
  },
  realtimeServer: {
    service: "Real-time Server (Socket.IO)",
    status: "healthy",
    latency: 18,
    uptime: 99.9,
    lastCheck: new Date("2026-02-12T09:00:00Z"),
    details: { connectedSockets: 8, rooms: 5, memoryMB: 128 },
  },
  overallStatus: "healthy",
  connectedDevices: 9,
  activeUsers: 3,
  memoryUsage: 62,
  cpuUsage: 35,
};

export const mockLatencyHistory = Array.from({ length: 60 }, (_, i) => ({
  time: new Date(Date.now() - (59 - i) * 60000).toISOString(),
  api: 30 + Math.random() * 40,
  database: 5 + Math.random() * 15,
  mqtt: 15 + Math.random() * 30,
  realtime: 10 + Math.random() * 20,
}));
