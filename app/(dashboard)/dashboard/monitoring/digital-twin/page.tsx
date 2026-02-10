"use client";

import React from "react";
import { Box } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function DigitalTwinPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Digital Twin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          3D factory visualization with real-time data overlay
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Box size={40} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          3D Digital Twin
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
          Interactive 3D factory model with real-time sensor overlays, machine
          status visualization, and virtual tour capability. Powered by React
          Three Fiber.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
            React Three Fiber
          </div>
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
            GLTF Models
          </div>
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
            Real-time Overlays
          </div>
          <div className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
            Virtual Tour
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-8">Coming in Phase 3</p>
      </Card>
    </div>
  );
}
