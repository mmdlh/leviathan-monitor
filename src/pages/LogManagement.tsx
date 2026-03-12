import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Download, Clock, AlertTriangle, Info, Bug, CheckCircle } from "lucide-react";
import { useState } from "react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.1 } } };

const logLevels: Record<string, { icon: any; color: string; bg: string }> = {
  ERROR: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  WARN: { icon: Bug, color: "text-glow-yellow", bg: "bg-glow-yellow/10" },
  INFO: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  DEBUG: { icon: CheckCircle, color: "text-glow-green", bg: "bg-glow-green/10" },
};

const logs = Array.from({ length: 40 }, (_, i) => {
  const levels = ["ERROR", "WARN", "INFO", "INFO", "DEBUG", "INFO", "INFO", "WARN"] as const;
  const level = levels[i % levels.length];
  const services = ["api-gateway", "auth-service", "db-proxy", "cache-layer", "msg-queue", "file-store", "scheduler", "monitor"];
  const msgs: Record<string, string[]> = {
    ERROR: ["Connection timeout after 30000ms", "Failed to write to disk: No space left", "Unhandled exception in worker thread", "SSL certificate verification failed"],
    WARN: ["Memory usage exceeds 80% threshold", "Slow query detected: 2.3s execution time", "Rate limiter triggered: 429 responses", "Deprecated API version in use"],
    INFO: ["Service started successfully on port 8080", "Health check passed", "Configuration reloaded", "Cache invalidation completed", "Backup snapshot created"],
    DEBUG: ["Request processed in 12ms", "Cache hit ratio: 94.2%", "GC pause: 15ms", "Connection pool: 45/100 active"],
  };
  const messages = msgs[level];
  return {
    id: i + 1,
    timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10).toISOString().replace("T", " ").slice(0, 19),
    level,
    service: services[i % services.length],
    message: messages[Math.floor(Math.random() * messages.length)],
    requestId: `req-${Math.random().toString(36).slice(2, 10)}`,
  };
});

export default function LogManagement() {
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const filtered = logs.filter((l) => {
    if (activeLevel && l.level !== activeLevel) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.service.includes(search)) return false;
    return true;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-5 h-full flex flex-col">
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">日志管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">集中式日志查询与分析</p>
        </div>
        <button className="glass-card flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-3.5 w-3.5" /> 导出日志
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "总日志量", value: "2.4M", sub: "今日", color: "text-primary" },
          { label: "错误率", value: "0.12%", sub: "较昨日 -0.03%", color: "text-destructive" },
          { label: "警告数", value: "1,847", sub: "今日", color: "text-glow-yellow" },
          { label: "平均延迟", value: "23ms", sub: "日志写入", color: "text-glow-green" },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`font-display text-xl font-bold font-mono-num mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div variants={item} className="glass-card rounded-2xl p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-muted/30 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索日志内容、服务名称..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <div className="flex gap-1">
          {Object.entries(logLevels).map(([level, cfg]) => (
            <button
              key={level}
              onClick={() => setActiveLevel(activeLevel === level ? null : level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeLevel === level ? `${cfg.bg} ${cfg.color}` : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Clock className="h-3 w-3" /> 最近1小时 <ChevronDown className="h-3 w-3" />
        </button>
      </motion.div>

      {/* Log Entries */}
      <motion.div variants={item} className="glass-card rounded-2xl flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1 font-mono text-xs">
          {filtered.map((log) => {
            const cfg = logLevels[log.level];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={log.id}
                variants={item}
                className={`flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors ${
                  log.level === "ERROR" ? "bg-destructive/5" : ""
                }`}
              >
                <span className="text-muted-foreground w-36 shrink-0 font-mono-num">{log.timestamp}</span>
                <span className={`flex items-center gap-1 w-14 shrink-0 ${cfg.color}`}>
                  <Icon className="h-3 w-3" />
                  {log.level}
                </span>
                <span className="text-primary w-24 shrink-0">{log.service}</span>
                <span className="text-foreground flex-1">{log.message}</span>
                <span className="text-muted-foreground/50 w-24 shrink-0 text-right">{log.requestId}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
