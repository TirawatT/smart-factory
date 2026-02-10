"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Factory, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";

const demoAccounts = [
  { role: "Admin", email: "admin@factory.com", password: "admin123" },
  { role: "Manager", email: "somchai@factory.com", password: "manager123" },
  { role: "Operator", email: "prasit@factory.com", password: "operator123" },
  { role: "Guest", email: "guest@factory.com", password: "guest123" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
          <Factory size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Smart Factory</h1>
        <p className="text-sm text-muted-foreground mt-1">
          IoT Monitoring & Control Platform
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-[var(--radius-sm)] bg-danger-light text-danger text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>

      {/* Demo Accounts */}
      <div className="mt-6 bg-card border border-border rounded-[var(--radius-lg)] p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Demo Accounts
        </p>
        <div className="grid grid-cols-2 gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              onClick={() => fillDemo(account)}
              className="text-left px-3 py-2 rounded-[var(--radius-sm)] border border-border hover:bg-muted transition-colors text-xs cursor-pointer"
            >
              <span className="font-medium text-foreground">
                {account.role}
              </span>
              <br />
              <span className="text-muted-foreground">{account.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
