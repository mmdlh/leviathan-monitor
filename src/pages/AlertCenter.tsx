import { motion } from "framer-motion";
import { AlertTriangle, Bell, CheckCircle2, Clock, Filter, Search, ShieldAlert, XCircle } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.1 } } };

const alerts = [
  { id: 1, level: "critical", device: "SRV-DB-012", msg: "数据库连接池耗尽，最大连接数已达上限", time: "2分钟前", acked: false },
  { id: 2, level: "critical", device: "SRV-APP-007", msg: "磁盘使用率超过95%，存在宕机风险", time: "8分钟前", acked: false },
  { id: 3, level: "warning", device: "SW-CORE-03", msg: "端口 Gi0/24 CRC错误数异常增长", time: "15分钟前", acked: false },
  { id: 4, level: "warning", device: "RT-EDGE-01", msg: "BGP邻居会话抖动频繁", time: "32分钟前", acked: true },
  { id: 5, level: "critical", device: "SRV-WEB-019", msg: "OOM Killer 触发，进程被强制终止", time: "45分钟前", acked: true },
  { id: 6, level: "info", device: "SRV-CACHE-02", msg: "Redis 主从同步延迟超过阈值", time: "1小时前", acked: false },
  { id: 7, level: "warning", device: "SRV-APP-003", msg: "JVM GC时间占比过高", time: "1.5小时前", acked: true },
  { id: 8, level: "info", device: "SW-ACCESS-12", msg: "端口速率协商降级至100Mbps", time: "2小时前", acked: true },
  { id: 9, level: "critical", device: "SRV-DB-015", msg: "慢查询数量超过告警阈值", time: "3小时前", acked: true },
  { id: 10, level: "warning", device: "RT-CORE-02", msg: "路由表条目数接近硬件限制", time: "4小时前", acked: true },
  { id: 11, level: "info", device: "SRV-LOG-01", msg: "日志存储空间使用率达到70%", time: "5小时前", acked: true },
  { id: 12, level: "info", device: "SRV-MON-01", msg: "SNMP轮询超时设备数增加", time: "6小时前", acked: true },
];

const levelConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "严重" },
  warning: { icon: AlertTriangle, color: "text-glow-yellow", bg: "bg-glow-yellow/10", label: "警告" },
  info: { icon: Bell, color: "text-primary", bg: "bg-primary/10", label: "信息" },
};

const summaryData = [
  { name: "严重", value: 4, color: "hsl(0,80%,60%)" },
  { name: "警告", value: 4, color: "hsl(45,100%,50%)" },
  { name: "信息", value: 4, color: "hsl(200,100%,50%)" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  严重: Math.floor(Math.random() * 5),
  警告: Math.floor(Math.random() * 8),
  信息: Math.floor(Math.random() * 10),
}));

const tooltipStyle = {
  background: "hsl(220,35%,12%)",
  border: "1px solid hsla(200,100%,50%,0.2)",
  borderRadius: 12,
  color: "hsl(210,20%,85%)",
  fontSize: 12,
};

export default function AlertCenter() {
  const [tab, setTab] = useState<"all" | "unacked">("all");
  const filtered = tab === "unacked" ? alerts.filter((a) => !a.acked) : alerts;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={item}>
        <h1 className="font-display text-3xl font-bold text-foreground">告警中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">实时告警监控与事件管理</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "活跃告警", value: "12", icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "未确认", value: "5", icon: Bell, color: "text-glow-yellow", bg: "bg-glow-yellow/10" },
          { label: "今日已处理", value: "34", icon: CheckCircle2, color: "text-glow-green", bg: "bg-glow-green/10" },
          { label: "平均响应", value: "4.2m", icon: Clock, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="glass-card glass-card-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold text-foreground font-mono-num mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">告警级别分布</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={summaryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                {summaryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {summaryData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="col-span-2 glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">24小时告警趋势</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="严重" stackId="a" fill="hsl(0,80%,60%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="警告" stackId="a" fill="hsl(45,100%,50%)" />
              <Bar dataKey="信息" stackId="a" fill="hsl(200,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alert List */}
      <motion.div variants={item} className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(["all", "unacked"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "全部告警" : "未确认"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="搜索告警..." className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-40" />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((a) => {
            const cfg = levelConfig[a.level];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={a.id}
                variants={item}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                  a.level === "critical" && !a.acked
                    ? "glass-card-alert"
                    : "hover:bg-muted/20"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg}`}>
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-xs font-mono-num text-primary font-medium w-28">{a.device}</span>
                <span className="text-xs text-foreground flex-1">{a.msg}</span>
                <span className="text-[11px] text-muted-foreground">{a.time}</span>
                {!a.acked && (
                  <button className="text-[11px] text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md bg-primary/10">
                    确认
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
