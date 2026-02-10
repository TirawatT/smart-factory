"use client";

import React, { useState } from "react";
import { Save, Wifi, Mail, Bell, Shield, Database } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { usePermission } from "@/stores/authStore";

export default function SystemSettingsPage() {
  const canEdit = usePermission("system:settings");
  const { addToast } = useToast();

  const [mqtt, setMqtt] = useState({
    host: "mqtt.factory.local",
    port: "1883",
    username: "factory_iot",
    password: "********",
    topic: "factory/#",
    keepAlive: "60",
  });

  const [smtp, setSmtp] = useState({
    host: "smtp.factory.local",
    port: "587",
    username: "alerts@factory.com",
    password: "********",
    from: "Smart Factory <alerts@factory.com>",
    tls: true,
  });

  const [thresholds, setThresholds] = useState({
    tempWarning: "75",
    tempCritical: "85",
    humidityLow: "30",
    humidityHigh: "70",
    powerMax: "500",
    vibrationMax: "5.0",
  });

  const [general, setGeneral] = useState({
    factoryName: "Smart Factory Demo",
    timezone: "Asia/Bangkok",
    dataRetentionDays: "90",
    telemetryInterval: "15",
    language: "th",
  });

  const handleSave = (section: string) => {
    addToast("success", `${section} settings saved`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure system parameters and integrations
        </p>
      </div>

      <Tabs defaultTab="general">
        <TabList>
          <Tab value="general">
            <Database size={14} className="inline mr-1" />
            General
          </Tab>
          <Tab value="mqtt">
            <Wifi size={14} className="inline mr-1" />
            MQTT
          </Tab>
          <Tab value="smtp">
            <Mail size={14} className="inline mr-1" />
            Email (SMTP)
          </Tab>
          <Tab value="thresholds">
            <Bell size={14} className="inline mr-1" />
            Thresholds
          </Tab>
        </TabList>

        {/* General Settings */}
        <TabPanel value="general">
          <Card className="mt-4">
            <CardHeader
              title="General Settings"
              subtitle="Basic factory configuration"
            />
            <div className="p-4 space-y-4 max-w-xl">
              <Input
                label="Factory Name"
                value={general.factoryName}
                onChange={(e) =>
                  setGeneral({ ...general, factoryName: e.target.value })
                }
                disabled={!canEdit}
              />
              <Input
                label="Timezone"
                value={general.timezone}
                onChange={(e) =>
                  setGeneral({ ...general, timezone: e.target.value })
                }
                disabled={!canEdit}
              />
              <Input
                label="Data Retention (days)"
                type="number"
                value={general.dataRetentionDays}
                onChange={(e) =>
                  setGeneral({ ...general, dataRetentionDays: e.target.value })
                }
                disabled={!canEdit}
              />
              <Input
                label="Telemetry Interval (seconds)"
                type="number"
                value={general.telemetryInterval}
                onChange={(e) =>
                  setGeneral({ ...general, telemetryInterval: e.target.value })
                }
                disabled={!canEdit}
              />
              {canEdit && (
                <Button
                  icon={<Save size={16} />}
                  onClick={() => handleSave("General")}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </Card>
        </TabPanel>

        {/* MQTT Settings */}
        <TabPanel value="mqtt">
          <Card className="mt-4">
            <CardHeader
              title="MQTT Broker Configuration"
              subtitle="IoT message broker settings"
            />
            <div className="p-4 space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Host"
                  value={mqtt.host}
                  onChange={(e) => setMqtt({ ...mqtt, host: e.target.value })}
                  disabled={!canEdit}
                />
                <Input
                  label="Port"
                  type="number"
                  value={mqtt.port}
                  onChange={(e) => setMqtt({ ...mqtt, port: e.target.value })}
                  disabled={!canEdit}
                />
              </div>
              <Input
                label="Username"
                value={mqtt.username}
                onChange={(e) => setMqtt({ ...mqtt, username: e.target.value })}
                disabled={!canEdit}
              />
              <Input
                label="Password"
                type="password"
                value={mqtt.password}
                onChange={(e) => setMqtt({ ...mqtt, password: e.target.value })}
                disabled={!canEdit}
              />
              <Input
                label="Topic"
                value={mqtt.topic}
                onChange={(e) => setMqtt({ ...mqtt, topic: e.target.value })}
                disabled={!canEdit}
              />
              <Input
                label="Keep Alive (seconds)"
                type="number"
                value={mqtt.keepAlive}
                onChange={(e) =>
                  setMqtt({ ...mqtt, keepAlive: e.target.value })
                }
                disabled={!canEdit}
              />
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    icon={<Save size={16} />}
                    onClick={() => handleSave("MQTT")}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline">Test Connection</Button>
                </div>
              )}
            </div>
          </Card>
        </TabPanel>

        {/* SMTP Settings */}
        <TabPanel value="smtp">
          <Card className="mt-4">
            <CardHeader
              title="Email (SMTP) Configuration"
              subtitle="Notification email settings"
            />
            <div className="p-4 space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SMTP Host"
                  value={smtp.host}
                  onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                  disabled={!canEdit}
                />
                <Input
                  label="Port"
                  type="number"
                  value={smtp.port}
                  onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                  disabled={!canEdit}
                />
              </div>
              <Input
                label="Username"
                value={smtp.username}
                onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
                disabled={!canEdit}
              />
              <Input
                label="Password"
                type="password"
                value={smtp.password}
                onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                disabled={!canEdit}
              />
              <Input
                label="From Address"
                value={smtp.from}
                onChange={(e) => setSmtp({ ...smtp, from: e.target.value })}
                disabled={!canEdit}
              />
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    icon={<Save size={16} />}
                    onClick={() => handleSave("SMTP")}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline">Send Test Email</Button>
                </div>
              )}
            </div>
          </Card>
        </TabPanel>

        {/* Threshold Settings */}
        <TabPanel value="thresholds">
          <Card className="mt-4">
            <CardHeader
              title="Alert Thresholds"
              subtitle="Default threshold values for monitoring"
            />
            <div className="p-4 space-y-4 max-w-xl">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Temperature (°C)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Warning"
                  type="number"
                  value={thresholds.tempWarning}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      tempWarning: e.target.value,
                    })
                  }
                  disabled={!canEdit}
                />
                <Input
                  label="Critical"
                  type="number"
                  value={thresholds.tempCritical}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      tempCritical: e.target.value,
                    })
                  }
                  disabled={!canEdit}
                />
              </div>
              <h4 className="text-sm font-semibold text-muted-foreground">
                Humidity (%)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Low"
                  type="number"
                  value={thresholds.humidityLow}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      humidityLow: e.target.value,
                    })
                  }
                  disabled={!canEdit}
                />
                <Input
                  label="High"
                  type="number"
                  value={thresholds.humidityHigh}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      humidityHigh: e.target.value,
                    })
                  }
                  disabled={!canEdit}
                />
              </div>
              <h4 className="text-sm font-semibold text-muted-foreground">
                Other
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Power (kW)"
                  type="number"
                  value={thresholds.powerMax}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, powerMax: e.target.value })
                  }
                  disabled={!canEdit}
                />
                <Input
                  label="Max Vibration (mm/s)"
                  type="number"
                  value={thresholds.vibrationMax}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      vibrationMax: e.target.value,
                    })
                  }
                  disabled={!canEdit}
                />
              </div>
              {canEdit && (
                <Button
                  icon={<Save size={16} />}
                  onClick={() => handleSave("Thresholds")}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
}
