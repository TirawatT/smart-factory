"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Box, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

const DIGITAL_TWIN_URL = process.env.NEXT_PUBLIC_DIGITAL_TWIN_URL;

export default function DigitalTwinPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isFullscreen && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Digital Twin</h1>
            <p className="text-muted-foreground">
              แผนผังโรงงาน 3D แบบ Virtual Tour — 3DVista
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Box className="mr-1 h-3 w-3" />
            3DVista
          </Badge>
        </div>
      )}

      {/* Iframe or Placeholder */}
      <Card
        className={cn(
          isFullscreen && "fixed inset-0 z-50 rounded-none border-0",
        )}
      >
        {!isFullscreen && (
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">
              Virtual Tour — โรงงาน Smart Factory
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="mr-1 h-3 w-3" /> เต็มจอ
              </Button>
            </div>
          </CardHeader>
        )}
        <CardContent className={cn("p-0", isFullscreen && "h-full")}>
          {isFullscreen && (
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsFullscreen(false)}
              >
                <Minimize2 className="mr-1 h-3 w-3" /> ออกจากเต็มจอ
              </Button>
            </div>
          )}
          {DIGITAL_TWIN_URL ? (
            <iframe
              src={DIGITAL_TWIN_URL}
              className={cn(
                "w-full border-0",
                isFullscreen ? "h-full" : "h-[calc(100vh-280px)] min-h-[500px]",
              )}
              title="Digital Twin — 3DVista Virtual Tour"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div
              className={cn(
                "flex flex-col items-center justify-center bg-muted/30",
                isFullscreen ? "h-full" : "h-[calc(100vh-280px)] min-h-[500px]",
              )}
            >
              <Box className="h-24 w-24 text-muted-foreground/30 mb-6" />
              <h3 className="text-lg font-semibold mb-2">
                Digital Twin — Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                3DVista Virtual Tour จะถูกฝังที่นี่เมื่อมีการตั้งค่า URL ในไฟล์{" "}
                <code className="bg-muted px-1 rounded">.env.local</code>
              </p>
              <div className="bg-muted rounded-lg p-4 text-sm font-mono">
                <p className="text-muted-foreground">
                  NEXT_PUBLIC_DIGITAL_TWIN_URL=&quot;https://your-3dvista-url.com&quot;
                </p>
              </div>
              <Button variant="outline" className="mt-4" asChild>
                <a
                  href="https://www.3dvista.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  เรียนรู้เพิ่มเติมเกี่ยวกับ 3DVista
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
