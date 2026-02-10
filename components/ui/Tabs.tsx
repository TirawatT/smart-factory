"use client";

import React, { createContext, useContext, useState } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
});

interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultTab, children, className = "" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = "" }: TabListProps) {
  return (
    <div className={`flex gap-1 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
}

export function Tab({ value, children }: TabProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`
        px-4 py-2.5 text-sm font-medium transition-colors -mb-px cursor-pointer
        ${
          isActive
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
        }
      `}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

export function TabPanel({ value, children }: TabPanelProps) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className="py-4 animate-fade-in">{children}</div>;
}
