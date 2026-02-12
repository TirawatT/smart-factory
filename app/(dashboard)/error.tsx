"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h2 className="text-lg font-semibold">เกิดข้อผิดพลาด</h2>
            <p className="text-sm text-muted-foreground mt-1">
              ไม่สามารถโหลดหน้า Dashboard ได้ กรุณาลองใหม่อีกครั้ง
            </p>
          </div>
          <Button onClick={reset}>ลองใหม่</Button>
        </CardContent>
      </Card>
    </div>
  );
}
