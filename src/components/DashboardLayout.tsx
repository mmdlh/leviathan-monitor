import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Monitor,
  Activity,
  AlertTriangle,
  BarChart3,
  Network,
  FileText,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "运行总览", path: "/" },
  { icon: Monitor, label: "设备列表", path: "/devices" },
  { icon: Activity, label: "实时监控", path: "/monitor" },
  { icon: AlertTriangle, label: "告警中心", path: "/alerts" },
  { icon: BarChart3, label: "性能分析", path: "/analytics" },
  { icon: Network, label: "网络拓扑", path: "/topology" },
  { icon: FileText, label: "日志管理", path: "/logs" },
  { icon: Settings, label: "系统设置", path: "/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background bg-grid">
      {/* Sidebar */}
      <aside className="relative z-10 flex w-[260px] flex-shrink-0 flex-col border-r border-border bg-sidebar">
        {/* Logo / Title */}
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Monitor className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
              DeviceHub
            </h1>
            <p className="text-[11px] text-muted-foreground">智能设备管理平台</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "hsla(200, 100%, 50%, 0.08)",
                        boxShadow: "inset 0 0 0 1px hsla(200, 100%, 50%, 0.15), 0 0 20px hsla(200, 100%, 50%, 0.05)",
                      }}
                      transition={{ type: "spring" as const, duration: 0.5, bounce: 0.15 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary"
                      style={{ boxShadow: "0 0 8px hsla(200, 100%, 50%, 0.6)" }}
                      transition={{ type: "spring" as const, duration: 0.5, bounce: 0.15 }}
                    />
                  )}
                  <Icon className="relative z-10 h-[18px] w-[18px]" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4">
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-glow-green glow-dot" />
              <span className="text-xs text-muted-foreground">系统状态</span>
            </div>
            <p className="text-xs text-foreground font-medium">运行正常 · 1,847 台在线</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring" as const, duration: 0.5, bounce: 0.1 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
