import { motion } from "framer-motion";
import { Server, Router, Monitor, HardDrive, Wifi, Database, Globe, Shield } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.6, bounce: 0.1 } } };

interface TopoNode {
  id: string;
  label: string;
  icon: any;
  x: number;
  y: number;
  status: "online" | "warning" | "offline";
  type: string;
}

const nodes: TopoNode[] = [
  { id: "inet", label: "Internet", icon: Globe, x: 400, y: 30, status: "online", type: "网关" },
  { id: "fw", label: "FW-MAIN", icon: Shield, x: 400, y: 120, status: "online", type: "防火墙" },
  { id: "core1", label: "SW-CORE-01", icon: Server, x: 250, y: 220, status: "online", type: "核心交换" },
  { id: "core2", label: "SW-CORE-02", icon: Server, x: 550, y: 220, status: "online", type: "核心交换" },
  { id: "dist1", label: "SW-DIST-01", icon: Router, x: 100, y: 330, status: "online", type: "汇聚交换" },
  { id: "dist2", label: "SW-DIST-02", icon: Router, x: 300, y: 330, status: "warning", type: "汇聚交换" },
  { id: "dist3", label: "SW-DIST-03", icon: Router, x: 500, y: 330, status: "online", type: "汇聚交换" },
  { id: "dist4", label: "SW-DIST-04", icon: Router, x: 700, y: 330, status: "online", type: "汇聚交换" },
  { id: "srv1", label: "SRV-DB-012", icon: Database, x: 60, y: 440, status: "online", type: "数据库" },
  { id: "srv2", label: "SRV-APP-007", icon: Monitor, x: 180, y: 440, status: "offline", type: "应用" },
  { id: "srv3", label: "SRV-WEB-019", icon: Monitor, x: 300, y: 440, status: "online", type: "Web" },
  { id: "srv4", label: "SRV-CACHE", icon: HardDrive, x: 420, y: 440, status: "online", type: "缓存" },
  { id: "srv5", label: "SRV-LOG-01", icon: HardDrive, x: 540, y: 440, status: "online", type: "日志" },
  { id: "srv6", label: "SRV-MON-01", icon: Monitor, x: 660, y: 440, status: "online", type: "监控" },
  { id: "ap1", label: "AP-FLOOR-1", icon: Wifi, x: 760, y: 440, status: "warning", type: "AP" },
];

const links: [string, string][] = [
  ["inet", "fw"],
  ["fw", "core1"], ["fw", "core2"],
  ["core1", "core2"],
  ["core1", "dist1"], ["core1", "dist2"],
  ["core2", "dist3"], ["core2", "dist4"],
  ["dist1", "srv1"], ["dist1", "srv2"],
  ["dist2", "srv3"], ["dist2", "srv4"],
  ["dist3", "srv5"], ["dist3", "srv6"],
  ["dist4", "ap1"],
];

const statusColor: Record<string, string> = {
  online: "hsl(140,70%,50%)",
  warning: "hsl(45,100%,50%)",
  offline: "hsl(0,80%,60%)",
};

export default function NetworkTopology() {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6 h-full flex flex-col">
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">网络拓扑</h1>
          <p className="mt-1 text-sm text-muted-foreground">可视化网络设备连接关系</p>
        </div>
        <div className="flex gap-4 text-xs">
          {[
            { label: "在线", color: "bg-glow-green" },
            { label: "警告", color: "bg-glow-yellow" },
            { label: "离线", color: "bg-destructive" },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${s.color}`} /> {s.label}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card rounded-2xl p-6 flex-1 min-h-0 relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 820 500" className="w-full h-full">
          {/* Links */}
          {links.map(([from, to]) => {
            const a = nodeMap[from], b = nodeMap[to];
            if (!a || !b) return null;
            const isWarn = a.status !== "online" || b.status !== "online";
            return (
              <motion.line
                key={`${from}-${to}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={isWarn ? "hsla(45,100%,50%,0.3)" : "hsla(200,100%,50%,0.15)"}
                strokeWidth={isWarn ? 2 : 1.5}
                strokeDasharray={b.status === "offline" ? "6 4" : "none"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n, i) => {
            const Icon = n.icon;
            const color = statusColor[n.status];
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring" as const, duration: 0.5 }}
                className="cursor-pointer"
              >
                {/* Glow */}
                <circle cx={n.x} cy={n.y} r={24} fill={color} opacity={0.08} />
                <circle cx={n.x} cy={n.y} r={18} fill="hsl(220,35%,12%)" stroke={color} strokeWidth={1.5} opacity={0.9} />
                {/* Icon placeholder */}
                <circle cx={n.x} cy={n.y} r={4} fill={color} />
                {/* Label */}
                <text x={n.x} y={n.y + 32} textAnchor="middle" fill="hsl(210,20%,85%)" fontSize={9} fontFamily="Saira, sans-serif" fontWeight={600}>
                  {n.label}
                </text>
                <text x={n.x} y={n.y + 44} textAnchor="middle" fill="hsl(210,15%,55%)" fontSize={8} fontFamily="Inter, sans-serif">
                  {n.type}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      {/* Bottom stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "总设备数", value: "15", sub: "拓扑节点" },
          { label: "活跃链路", value: "14", sub: "正常连接" },
          { label: "告警链路", value: "2", sub: "需要关注" },
          { label: "网络延迟", value: "2.3ms", sub: "核心链路" },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold text-foreground font-mono-num mt-1">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
