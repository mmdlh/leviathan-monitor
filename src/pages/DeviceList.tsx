import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, MoreHorizontal, Circle, ArrowUpDown, Download } from "lucide-react";
import { useState } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.5, bounce: 0.1 } },
};

const devices = Array.from({ length: 20 }, (_, i) => ({
  id: `DEV-${String(1000 + i).padStart(4, "0")}`,
  name: [
    "数据库主节点", "Web应用服务器", "核心交换机", "边缘路由器", "文件存储", "负载均衡器",
    "缓存服务器", "日志收集器", "监控代理", "DNS服务器", "邮件服务器", "API网关",
    "消息队列", "搜索引擎", "备份服务器", "安全网关", "VPN服务器", "CDN节点", "容器编排", "CI/CD服务器",
  ][i],
  type: ["服务器", "交换机", "路由器", "终端"][i % 4],
  ip: `192.168.${Math.floor(i / 6) + 1}.${10 + i}`,
  status: i % 7 === 0 ? "offline" : i % 5 === 0 ? "warning" : "online",
  cpu: Math.floor(Math.random() * 80 + 10),
  mem: Math.floor(Math.random() * 70 + 20),
  uptime: `${Math.floor(Math.random() * 90 + 1)}天`,
  lastSeen: i % 7 === 0 ? "3小时前" : "刚刚",
}));

const statusMap: Record<string, { dot: string; text: string; label: string }> = {
  online: { dot: "bg-glow-green", text: "text-glow-green", label: "在线" },
  warning: { dot: "bg-glow-yellow", text: "text-glow-yellow", label: "警告" },
  offline: { dot: "bg-destructive", text: "text-destructive", label: "离线" },
};

export default function DeviceList() {
  const [search, setSearch] = useState("");
  const filtered = devices.filter(
    (d) => d.name.includes(search) || d.id.includes(search) || d.ip.includes(search)
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-5">
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">设备列表</h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {devices.length} 台设备 · {devices.filter((d) => d.status === "online").length} 在线</p>
        </div>
        <div className="flex gap-2">
          <button className="glass-card flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> 导出
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            + 添加设备
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="glass-card rounded-2xl p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-muted/30 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索设备名称、ID 或 IP..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        {["全部类型", "全部状态", "全部区域"].map((f) => (
          <button key={f} className="flex items-center gap-1.5 rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="h-3 w-3" /> {f} <ChevronDown className="h-3 w-3" />
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["设备ID", "名称", "类型", "IP地址", "状态", "CPU", "内存", "运行时间", "最后活跃", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  {h && (
                    <span className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                      {h} {h && <ArrowUpDown className="h-3 w-3" />}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const st = statusMap[d.status];
              return (
                <motion.tr
                  key={d.id}
                  variants={item}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono-num text-xs text-primary">{d.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{d.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.type}</td>
                  <td className="px-4 py-3 font-mono-num text-xs text-muted-foreground">{d.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${st.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.cpu > 80 ? "bg-destructive" : d.cpu > 60 ? "bg-glow-yellow" : "bg-primary"}`}
                          style={{ width: `${d.cpu}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono-num text-muted-foreground">{d.cpu}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.mem > 80 ? "bg-destructive" : d.mem > 60 ? "bg-glow-yellow" : "bg-glow-cyan"}`}
                          style={{ width: `${d.mem}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono-num text-muted-foreground">{d.mem}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono-num">{d.uptime}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.lastSeen}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
