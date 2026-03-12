import { motion } from "framer-motion";
import { Activity, Cpu, HardDrive, Thermometer, Wifi, Zap } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.6, bounce: 0.1 } } };

function generateTimeSeries(points: number, base: number, variance: number) {
  return Array.from({ length: points }, (_, i) => ({
    t: `${i * 5}s`,
    v: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance)),
  }));
}

const gaugeCards = [
  { label: "CPU 使用率", value: 47.2, icon: Cpu, color: "hsl(200,100%,50%)", threshold: 80 },
  { label: "内存占用", value: 63.8, icon: HardDrive, color: "hsl(180,80%,50%)", threshold: 85 },
  { label: "GPU 温度", value: 72, icon: Thermometer, color: "hsl(45,100%,50%)", threshold: 90, unit: "°C" },
  { label: "网络延迟", value: 12, icon: Wifi, color: "hsl(140,70%,50%)", threshold: 100, unit: "ms", max: 200 },
  { label: "功率消耗", value: 340, icon: Zap, color: "hsl(260,80%,65%)", threshold: 500, unit: "W", max: 600 },
  { label: "磁盘 I/O", value: 156, icon: Activity, color: "hsl(200,100%,50%)", threshold: 300, unit: "MB/s", max: 400 },
];

function GaugeRing({ value, max = 100, color, size = 80 }: { value: number; max?: number; color: string; size?: number }) {
  const pct = (value / max) * 100;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsla(210,100%,50%,0.08)" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

export default function RealtimeMonitor() {
  const [cpuData, setCpuData] = useState(generateTimeSeries(30, 47, 20));
  const [memData, setMemData] = useState(generateTimeSeries(30, 64, 15));
  const [netData, setNetData] = useState(generateTimeSeries(30, 2400, 800));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData((prev) => {
        const next = [...prev.slice(1)];
        next.push({ t: `${next.length * 5}s`, v: Math.max(5, Math.min(95, prev[prev.length - 1].v + (Math.random() - 0.5) * 10)) });
        return next;
      });
      setMemData((prev) => {
        const next = [...prev.slice(1)];
        next.push({ t: `${next.length * 5}s`, v: Math.max(20, Math.min(95, prev[prev.length - 1].v + (Math.random() - 0.5) * 6)) });
        return next;
      });
      setNetData((prev) => {
        const next = [...prev.slice(1)];
        next.push({ t: `${next.length * 5}s`, v: Math.max(500, Math.min(4000, prev[prev.length - 1].v + (Math.random() - 0.5) * 400)) });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tooltipStyle = {
    background: "hsl(220,35%,12%)",
    border: "1px solid hsla(200,100%,50%,0.2)",
    borderRadius: 12,
    color: "hsl(210,20%,85%)",
    fontSize: 12,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={item}>
        <h1 className="font-display text-3xl font-bold text-foreground">实时监控</h1>
        <p className="mt-1 text-sm text-muted-foreground">SRV-APP-007 · 192.168.1.107</p>
      </motion.div>

      {/* Gauge Cards */}
      <div className="grid grid-cols-6 gap-4">
        {gaugeCards.map((g) => (
          <motion.div key={g.label} variants={item} className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col items-center text-center">
            <GaugeRing value={g.value} max={g.max || 100} color={g.color} size={72} />
            <p className="font-display text-lg font-bold text-foreground font-mono-num mt-2">
              {g.value}{g.unit || "%"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{g.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" /> CPU 实时负载
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="t" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="v" stroke="hsl(200,100%,50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-glow-cyan animate-pulse-glow" /> 内存使用趋势
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={memData}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(180,80%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(180,80%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
              <XAxis dataKey="t" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="v" stroke="hsl(180,80%,50%)" fill="url(#memGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Network Chart - full width */}
      <motion.div variants={item} className="glass-card rounded-2xl p-5">
        <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-glow-green animate-pulse-glow" /> 网络吞吐量 (Mbps)
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={netData}>
            <defs>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(140,70%,50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(140,70%,50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,100%,50%,0.06)" />
            <XAxis dataKey="t" tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(210,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="v" stroke="hsl(140,70%,50%)" fill="url(#netGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Process Table */}
      <motion.div variants={item} className="glass-card rounded-2xl p-5">
        <h2 className="font-display text-base font-semibold text-foreground mb-4">进程资源占用 TOP 10</h2>
        <div className="space-y-2">
          {[
            { name: "mysql", pid: 1234, cpu: 23.4, mem: 18.2 },
            { name: "nginx", pid: 5678, cpu: 12.1, mem: 8.7 },
            { name: "node", pid: 9012, cpu: 8.9, mem: 15.3 },
            { name: "redis", pid: 3456, cpu: 5.2, mem: 12.1 },
            { name: "docker", pid: 7890, cpu: 4.8, mem: 9.4 },
            { name: "python3", pid: 2345, cpu: 3.7, mem: 6.8 },
            { name: "java", pid: 6789, cpu: 3.1, mem: 22.5 },
            { name: "postgres", pid: 4567, cpu: 2.9, mem: 14.2 },
            { name: "elasticsearch", pid: 8901, cpu: 2.4, mem: 19.8 },
            { name: "kafka", pid: 1357, cpu: 1.8, mem: 11.3 },
          ].map((p, i) => (
            <div key={p.pid} className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors">
              <span className="text-xs text-muted-foreground w-6 font-mono-num">{i + 1}</span>
              <span className="text-sm text-primary font-medium w-32">{p.name}</span>
              <span className="text-xs text-muted-foreground font-mono-num w-16">PID {p.pid}</span>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-8">CPU</span>
                <div className="h-1.5 flex-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${p.cpu * 3}%` }} />
                </div>
                <span className="text-xs font-mono-num text-foreground w-12 text-right">{p.cpu}%</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-8">MEM</span>
                <div className="h-1.5 flex-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full bg-glow-cyan" style={{ width: `${p.mem * 3}%` }} />
                </div>
                <span className="text-xs font-mono-num text-foreground w-12 text-right">{p.mem}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
