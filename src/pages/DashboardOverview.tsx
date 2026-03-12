import { motion } from "framer-motion";
import {
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  Server,
  Clock,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.6, bounce: 0.1 } },
};

const kpiData = [
  { label: "在线设备", value: "1,847", change: "+12", up: true, icon: Monitor, color: "primary" },
  { label: "CPU 平均负载", value: "47.2%", change: "-3.1%", up: false, icon: Cpu, color: "cyan" },
  { label: "存储使用率", value: "68.5%", change: "+2.4%", up: true, icon: HardDrive, color: "purple" },
  { label: "网络吞吐", value: "3.2Gbps", change: "+18%", up: true, icon: Wifi, color: "green" },
];

const trafficData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  入站: Math.floor(Math.random() * 2000 + 1000),
  出站: Math.floor(Math.random() * 1500 + 800),
}));

const deviceTypeData = [
  { name: "服务器", value: 645, color: "hsl(200,100%,50%)" },
  { name: "交换机", value: 412, color: "hsl(180,80%,50%)" },
  { name: "路由器", value: 238, color: "hsl(260,80%,65%)" },
  { name: "终端设备", value: 552, color: "hsl(140,70%,50%)" },
];

const alertData = [
  { id: 1, level: "critical", device: "SRV-DB-012", msg: "CPU使用率超过95%", time: "2分钟前" },
  { id: 2, level: "warning", device: "SW-CORE-03", msg: "端口流量异常波动", time: "15分钟前" },
  { id: 3, level: "critical", device: "SRV-APP-007", msg: "磁盘空间不足5%", time: "23分钟前" },
  { id: 4, level: "info", device: "RT-EDGE-01", msg: "固件版本已过期", time: "1小时前" },
  { id: 5, level: "warning", device: "SRV-WEB-019", msg: "内存使用率超过85%", time: "2小时前" },
];

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"][i],
  告警: Math.floor(Math.random() * 30 + 5),
  已处理: Math.floor(Math.random() * 25 + 5),
}));

const colorMap: Record<string, string> = {
  primary: "text-primary",
  cyan: "text-glow-cyan",
  purple: "text-glow-purple",
  green: "text-glow-green",
};
const bgMap: Record<string, string> = {
  primary: "bg-primary/10",
  cyan: "bg-glow-cyan/10",
  purple: "bg-glow-purple/10",
  green: "bg-glow-green/10",
};

export default function DashboardOverview() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            设备运行总览
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            实时监控 · 最后更新于 {new Date().toLocaleTimeString("zh-CN")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>自动刷新: 30s</span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={item}
              className="glass-card glass-card-hover rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgMap[kpi.color]}`}>
                  <Icon className={`h-5 w-5 ${colorMap[kpi.color]}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-glow-green" : "text-glow-cyan"}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="font-display text-2xl font-bold text-foreground font-mono-num mt-1">
                {kpi.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Traffic Chart */}
        <motion.div variants={item} className="col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-foreground">
              网络流量趋势
            </h2>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> 入站
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-glow-cyan" /> 出站
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200,100%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(200,100%,50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(180,80%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(180,80%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(210,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220,35%,12%)",
                  border: "1px solid hsla(200,100%,50%,0.2)",
                  borderRadius: 12,
                  color: "hsl(210,20%,85%)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="入站" stroke="hsl(200,100%,50%)" fill="url(#colorIn)" strokeWidth={2} />
              <Area type="monotone" dataKey="出站" stroke="hsl(180,80%,50%)" fill="url(#colorOut)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Distribution */}
        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">
            设备类型分布
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {deviceTypeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(220,35%,12%)",
                  border: "1px solid hsla(200,100%,50%,0.2)",
                  borderRadius: 12,
                  color: "hsl(210,20%,85%)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {deviceTypeData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="text-foreground font-medium ml-auto font-mono-num">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Recent Alerts */}
        <motion.div variants={item} className="col-span-3 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              最新告警
            </h2>
            <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              查看全部 <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {alertData.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  alert.level === "critical"
                    ? "bg-destructive/5 hover:bg-destructive/10"
                    : alert.level === "warning"
                    ? "bg-glow-yellow/5 hover:bg-glow-yellow/10"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full glow-dot ${
                    alert.level === "critical"
                      ? "text-destructive bg-destructive"
                      : alert.level === "warning"
                      ? "text-glow-yellow bg-glow-yellow"
                      : "text-primary bg-primary"
                  }`}
                />
                <span className="text-xs font-mono-num text-primary font-medium w-28 shrink-0">
                  {alert.device}
                </span>
                <span className="text-xs text-foreground flex-1">{alert.msg}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div variants={item} className="col-span-2 glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">
            本周告警统计
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(210,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220,35%,12%)",
                  border: "1px solid hsla(200,100%,50%,0.2)",
                  borderRadius: 12,
                  color: "hsl(210,20%,85%)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="告警" fill="hsl(0,80%,60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="已处理" fill="hsl(140,70%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Server, label: "物理服务器", val: "312", sub: "98.7% 可用" },
          { icon: Zap, label: "平均功耗", val: "4.2kW", sub: "较昨日 -5%" },
          { icon: Activity, label: "平均响应", val: "138ms", sub: "P99: 420ms" },
          { icon: Monitor, label: "虚拟机", val: "2,156", sub: "负载均衡中" },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="glass-card glass-card-hover rounded-2xl p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-bold text-foreground font-mono-num">{s.val}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
