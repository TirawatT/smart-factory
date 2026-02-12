"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/theme-context";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";
import { Bell, Database, Globe, Palette, Save, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("settings", "update");
  const { theme, setTheme } = useTheme();

  // Mock settings state
  const [settings, setSettings] = useState({
    alertEmail: true,
    alertPopup: true,
    alertSms: false,
    maintenanceMode: false,
    dataRetention: "90",
    mqttBroker: "mqtt.hivemq.cloud",
    mqttPort: "8883",
    refreshInterval: "5",
    language: "th",
    timezone: "Asia/Bangkok",
  });

  const handleSave = () => {
    toast.success("บันทึกการตั้งค่าเรียบร้อย (Mock)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          ตั้งค่าระบบ การแจ้งเตือน และพารามิเตอร์ต่าง ๆ
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">
            <Globe className="mr-1 h-4 w-4" /> ทั่วไป
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1 h-4 w-4" /> การแจ้งเตือน
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-1 h-4 w-4" /> หน้าตา
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="mr-1 h-4 w-4" /> ระบบ
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ตั้งค่าทั่วไป</CardTitle>
              <CardDescription>ภาษา, Timezone และ Data Refresh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>ภาษา</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(v) =>
                      setSettings({ ...settings, language: v })
                    }
                    disabled={!canUpdate}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="th">ไทย</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(v) =>
                      setSettings({ ...settings, timezone: v })
                    }
                    disabled={!canUpdate}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Bangkok">
                        Asia/Bangkok (UTC+7)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        Asia/Tokyo (UTC+9)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data Refresh Interval (วินาที)</Label>
                <Input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      refreshInterval: e.target.value,
                    })
                  }
                  disabled={!canUpdate}
                  min={1}
                  max={60}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  ความถี่ในการอัพเดทข้อมูลอุปกรณ์ (1-60 วินาที)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ช่องทางการแจ้งเตือน</CardTitle>
              <CardDescription>
                เลือกช่องทางที่ต้องการรับแจ้งเตือน
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-xs text-muted-foreground">
                    รับแจ้งเตือนผ่าน Email เมื่อมี Alert ระดับ Warning/Critical
                  </p>
                </div>
                <Switch
                  checked={settings.alertEmail}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, alertEmail: v })
                  }
                  disabled={!canUpdate}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Popup</Label>
                  <p className="text-xs text-muted-foreground">
                    แสดง Popup แจ้งเตือนบนหน้าจอแบบ Real-time
                  </p>
                </div>
                <Switch
                  checked={settings.alertPopup}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, alertPopup: v })
                  }
                  disabled={!canUpdate}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">SMS</Label>
                  <p className="text-xs text-muted-foreground">
                    รับ SMS เฉพาะกรณี Critical Alert เท่านั้น
                  </p>
                </div>
                <Switch
                  checked={settings.alertSms}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, alertSms: v })
                  }
                  disabled={!canUpdate}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ธีม</CardTitle>
              <CardDescription>เลือกธีมสำหรับหน้า Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-muted/50",
                      theme === t && "border-primary bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full border-2",
                        t === "light" && "bg-white border-gray-300",
                        t === "dark" && "bg-gray-900 border-gray-700",
                        t === "system" &&
                          "bg-gradient-to-r from-white to-gray-900 border-gray-500",
                      )}
                    />
                    <span className="capitalize">{t}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">MQTT Broker</CardTitle>
              <CardDescription>การเชื่อมต่อ MQTT (Phase 2)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Broker URL</Label>
                  <Input
                    value={settings.mqttBroker}
                    onChange={(e) =>
                      setSettings({ ...settings, mqttBroker: e.target.value })
                    }
                    disabled={!canUpdate}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input
                    value={settings.mqttPort}
                    onChange={(e) =>
                      setSettings({ ...settings, mqttPort: e.target.value })
                    }
                    disabled={!canUpdate}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Retention</CardTitle>
              <CardDescription>กำหนดระยะเวลาเก็บข้อมูล</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Telemetry Data (วัน)</Label>
                <Input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) =>
                    setSettings({ ...settings, dataRetention: e.target.value })
                  }
                  disabled={!canUpdate}
                  className="max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <Shield className="h-4 w-4" /> Maintenance Mode
              </CardTitle>
              <CardDescription>
                เปิด Maintenance Mode เพื่อหยุดรับข้อมูลจากอุปกรณ์ชั่วคราว
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">เปิด Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">
                    ระบบจะหยุดรับข้อมูลจากอุปกรณ์ทุกตัว
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, maintenanceMode: v })
                  }
                  disabled={!canUpdate}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      {canUpdate && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> บันทึกการตั้งค่า
          </Button>
        </div>
      )}
    </div>
  );
}
