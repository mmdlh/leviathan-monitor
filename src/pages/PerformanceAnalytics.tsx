import { motion } from "framer-motion";
import { Calendar, ChevronDown, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6, bounce: 0.1 } } };

const tooltipStyle = {
  background: "hsl(220,35%,12%)",
  border: "1px solid hsla(200,100%,50%,0.2)",
  borderRadius: 12,
  color: "hsl(210,20%,85%)",
  fontSize: 12,
};

const cpuTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日`,
  avg: Math.floor(Math.random() * 30 + 35),
  peak: Math.floor(Math.random() * 30 + 60),
}));

const memTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日`,
  used: Math.floor(Math.random() * 20 + 55),
  cached: Math.floor(Math.random() * 15 + 10),
}));

const iopsData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  read: Math.floor(Math.random() * 5000 + 2000),
  write: Math.floor(Math.random() * 3000 + 1000),
}));

const radarData = [
  { metric: "CPU", A: 75, B: 60 },
  { metric: "内存", A: 68, B: 72 },
  { metric: "磁盘", A: 82, B: 55 },
  { metric: "网络", A: 60, B: 80 },
  { metric: "GPU", A: 45, B: 30 },
  { metric: "功耗", A: 70, B: 65 },
];

const latencyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  p50: Math.floor(Math.random() * 30 + 20),
  p95: Math.floor(Math.random() * 100 + 80),
  p99: Math.floor(Math.random() * 200 + 150),
}));

export default function PerformanceAnalytics() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">性能分析</h1>
          <p className="mt-1 text-sm text-muted-foreground">多维度性能指标深度分析</p>
        </div>
        <div className="flex gap-2">
          {["最近7天", "最近30天", "最近90天"].map((t, i) => (
            <button
              key={t}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <button className="glass-card flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" /> 自定义
          </button>
        </div>
      </motion.div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "平均CPU", value: "47.2%", trend: "-3.1%", good: true },
          { label: "峰值内存", value: "82.5%", trend: "+2.4%", good: false },
          { label: "磁盘IOPS", value: "4,231", trend: "+18%", good: true },
          { label: "网络延迟P95", value: "138ms", trend: "-12ms", good: true },
          { label: "可用性SLA", value: "99.97%", trend: "+0.02%", good: true },
        ].map((m) => (
          <motion.div key={m.label} variants={item} className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="font-display text-xl font-bold text-foreground font-mono-num mt-1">{m.value}</p>
            <p className={`text-[11px] mt-1 flex items-center gap-1 ${m.good ? "text-glow-green" : "text-destructive"}`}>
              <TrendingUp className="h-3 w-3" /> {m.trend}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CPU + Memory Charts */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">CPU 使用率趋势 (30天)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cpuTrend}>
              <defs>
                <linearGradient id="cpuAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200,100%,50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(200,100%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="avg" stroke="hsl(200,100%,50%)" fill="url(#cpuAvg)" strokeWidth={2} name="平均" />
              <Line type="monotone" dataKey="peak" stroke="hsl(0,80%,60%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="峰值" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">内存使用趋势 (30天)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={memTrend}>
              <defs>
                <linearGradient id="memUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(180,80%,50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(180,80%,50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memCached" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(260,80%,65%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(260,80%,65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="used" stroke="hsl(180,80%,50%)" fill="url(#memUsed)" strokeWidth={2} name="已使用" />
              <Area type="monotone" dataKey="cached" stroke="hsl(260,80%,65%)" fill="url(#memCached)" strokeWidth={2} name="缓存" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* IOPS + Radar + Latency */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">磁盘 IOPS</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={iopsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="read" fill="hsl(200,100%,50%)" radius={[2, 2, 0, 0]} name="读取" />
              <Bar dataKey="write" fill="hsl(260,80%,65%)" radius={[2, 2, 0, 0]} name="写入" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">集群性能雷达</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsla(210,100%,50%,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(210,15%,55%)", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="集群A" dataKey="A" stroke="hsl(200,100%,50%)" fill="hsl(200,100%,50%)" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="集群B" dataKey="B" stroke="hsl(180,80%,50%)" fill="hsl(180,80%,50%)" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">响应延迟分布</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="p50" stroke="hsl(140,70%,50%)" strokeWidth={2} dot={false} name="P50" />
              <Line type="monotone" dataKey="p95" stroke="hsl(45,100%,50%)" strokeWidth={2} dot={false} name="P95" />
              <Line type="monotone" dataKey="p99" stroke="hsl(0,80%,60%)" strokeWidth={2} dot={false} name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
