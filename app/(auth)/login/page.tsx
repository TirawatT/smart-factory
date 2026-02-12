"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, Factory, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/");
      } else {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Factory className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-bold">Smart Factory</CardTitle>
        <CardDescription>
          เข้าสู่ระบบ Industrial Monitoring & Control
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@smartfactory.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            เข้าสู่ระบบ
          </Button>
          <div className="text-center text-xs text-muted-foreground">
            <p className="font-medium mb-1">
              Demo Accounts (password: password123)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                className="underline hover:text-foreground"
                onClick={() => {
                  setEmail("admin@smartfactory.com");
                  setPassword("password123");
                }}
              >
                Admin
              </button>
              <span>•</span>
              <button
                type="button"
                className="underline hover:text-foreground"
                onClick={() => {
                  setEmail("manager@smartfactory.com");
                  setPassword("password123");
                }}
              >
                Manager
              </button>
              <span>•</span>
              <button
                type="button"
                className="underline hover:text-foreground"
                onClick={() => {
                  setEmail("operator@smartfactory.com");
                  setPassword("password123");
                }}
              >
                Operator
              </button>
              <span>•</span>
              <button
                type="button"
                className="underline hover:text-foreground"
                onClick={() => {
                  setEmail("guest@smartfactory.com");
                  setPassword("password123");
                }}
              >
                Guest
              </button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
