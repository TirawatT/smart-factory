import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Smart Factory",
  description: "Sign in to Smart Factory monitoring system",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      {children}
    </div>
  );
}
