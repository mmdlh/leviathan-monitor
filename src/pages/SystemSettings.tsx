import { motion } from "framer-motion";
import {
  Bell, Database, Globe, Key, Mail, Monitor, Palette, Save, Server,
  Shield, Sliders, User, Users, Wifi, Zap,
} from "lucide-react";
import { useState } from "react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.5, bounce: 0.1 } } };

const tabs = [
  { id: "general", label: "常规设置", icon: Sliders },
  { id: "notifications", label: "通知管理", icon: Bell },
  { id: "security", label: "安全配置", icon: Shield },
  { id: "integrations", label: "集成服务", icon: Globe },
];

function Toggle({ enabled, label, desc }: { enabled: boolean; label: string; desc: string }) {
  const [on, setOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-foreground font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-foreground"
          animate={{ x: on ? 20 : 0 }}
          transition={{ type: "spring" as const, duration: 0.3, bounce: 0.2 }}
        />
      </button>
    </div>
  );
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={item}>
        <h1 className="font-display text-3xl font-bold text-foreground">系统设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理平台配置与偏好设置</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <motion.div variants={item} className="w-56 space-y-1 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "general" && (
            <>
              <motion.div variants={item} className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">平台信息</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "平台名称", value: "DeviceHub 智能管理平台", icon: Monitor },
                    { label: "版本号", value: "v3.2.1 (Build 20240315)", icon: Zap },
                    { label: "授权类型", value: "企业版 · 无限设备", icon: Key },
                    { label: "数据库", value: "PostgreSQL 15.4", icon: Database },
                  ].map((info) => (
                    <div key={info.label} className="flex items-center gap-3 bg-muted/20 rounded-xl p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        <p className="text-sm text-foreground font-medium">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={item} className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">监控配置</h2>
                <div className="space-y-1 divide-y divide-border/50">
                  <Toggle enabled label="自动发现设备" desc="自动扫描网络中的新设备并添加到监控列表" />
                  <Toggle enabled label="实时数据推送" desc="通过 WebSocket 实时推送设备状态变更" />
                  <Toggle enabled={false} label="性能基线学习" desc="AI 自动学习设备性能基线并动态调整告警阈值" />
                  <Toggle enabled label="自动故障恢复" desc="检测到故障时自动尝试重启服务或切换备用节点" />
                </div>
              </motion.div>

              <motion.div variants={item} className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">数据保留策略</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "监控数据", value: "90 天", desc: "CPU/内存/网络等性能指标" },
                    { label: "告警记录", value: "180 天", desc: "历史告警事件与处理记录" },
                    { label: "操作日志", value: "365 天", desc: "用户操作审计日志" },
                  ].map((p) => (
                    <div key={p.label} className="bg-muted/20 rounded-xl p-4">
                      <p className="text-sm text-foreground font-medium">{p.label}</p>
                      <p className="font-display text-2xl font-bold text-primary font-mono-num mt-1">{p.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <motion.div variants={item} className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">通知渠道</h2>
                <div className="space-y-1 divide-y divide-border/50">
                  <Toggle enabled label="邮件通知" desc="发送告警邮件至管理员邮箱" />
                  <Toggle enabled label="企业微信" desc="通过企业微信机器人推送告警消息" />
                  <Toggle enabled={false} label="钉钉通知" desc="通过钉钉 Webhook 推送告警信息" />
                  <Toggle enabled label="短信通知" desc="严重告警通过短信通知值班人员" />
                  <Toggle enabled={false} label="电话告警" desc="P0级别告警自动拨打值班电话" />
                </div>
              </motion.div>

              <motion.div variants={item} className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">告警规则</h2>
                <div className="space-y-3">
                  {[
                    { name: "CPU 高负载", condition: "CPU > 90% 持续 5分钟", action: "邮件 + 企业微信", enabled: true },
                    { name: "内存不足", condition: "可用内存 < 10%", action: "邮件 + 短信", enabled: true },
                    { name: "磁盘空间", condition: "使用率 > 85%", action: "邮件", enabled: true },
                    { name: "设备离线", condition: "心跳超时 > 3分钟", action: "邮件 + 企业微信 + 短信", enabled: true },
                    { name: "网络延迟", condition: "延迟 > 500ms", action: "企业微信", enabled: false },
                  ].map((rule) => (
                    <div key={rule.name} className="flex items-center gap-4 bg-muted/20 rounded-xl p-4">
                      <div className={`h-2 w-2 rounded-full ${rule.enabled ? "bg-glow-green" : "bg-muted-foreground"}`} />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">{rule.condition}</p>
                      </div>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">{rule.action}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "security" && (
            <motion.div variants={item} className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">安全配置</h2>
              <div className="space-y-1 divide-y divide-border/50">
                <Toggle enabled label="双因素认证" desc="登录时要求输入动态验证码" />
                <Toggle enabled label="IP 白名单" desc="仅允许白名单 IP 访问管理后台" />
                <Toggle enabled label="操作审计" desc="记录所有管理操作并生成审计日志" />
                <Toggle enabled={false} label="自动锁定" desc="连续5次登录失败后自动锁定账号" />
                <Toggle enabled label="API 访问控制" desc="基于 Token 的 API 访问鉴权" />
                <Toggle enabled label="数据加密传输" desc="所有数据传输使用 TLS 1.3 加密" />
              </div>
            </motion.div>
          )}

          {activeTab === "integrations" && (
            <motion.div variants={item} className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">集成服务</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Prometheus", desc: "指标采集与存储", status: "已连接", ok: true },
                  { name: "Grafana", desc: "可视化仪表板", status: "已连接", ok: true },
                  { name: "ELK Stack", desc: "日志分析平台", status: "已连接", ok: true },
                  { name: "Ansible", desc: "自动化运维工具", status: "已连接", ok: true },
                  { name: "Kubernetes", desc: "容器编排平台", status: "配置中", ok: false },
                  { name: "ServiceNow", desc: "ITSM 工单系统", status: "未连接", ok: false },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center gap-4 bg-muted/20 rounded-xl p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${svc.ok ? "bg-glow-green/10" : "bg-muted/30"}`}>
                      <Server className={`h-5 w-5 ${svc.ok ? "text-glow-green" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">{svc.name}</p>
                      <p className="text-xs text-muted-foreground">{svc.desc}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md ${svc.ok ? "bg-glow-green/10 text-glow-green" : "bg-muted/30 text-muted-foreground"}`}>
                      {svc.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
