"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Leaf, Zap, TrendingDown, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-7xl mx-auto w-full relative min-h-screen">
      {/* Ambient background decoration for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-primary/5 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col items-center text-center mt-12 md:mt-24"
      >


        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05] mb-8"
        >
          從 BERS 評級，<br />
          到 <span className="text-foreground/60">
            淨零實踐
          </span> 的完整路徑
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl leading-relaxed font-medium text-center mx-auto"
        >
          取得 BERS 標章只是第一步。<br />
          我們整合 <strong className="text-foreground font-bold font-serif italic">AI 診斷</strong> 與 <strong className="text-foreground font-bold font-serif italic">智慧調控</strong>，
          <br className="hidden md:block" />
          為您提供從「建築健檢」到「設備優化」的頂級一站式節能方案。
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto sm:max-w-none sm:w-auto">
          <Link href="/assessment" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full group relative overflow-hidden bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_8px_30px_rgba(202,138,4,0.3)] transition-all duration-300">
              <span className="relative z-10 font-bold flex items-center gap-2">
                開始 BERS 評估
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-transparent border-neutral-200 hover:bg-neutral-100 flex items-center gap-2 text-foreground font-bold transition-all duration-300">
            <Info size={18} />
            預約專家諮詢
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-6 mt-32 w-full"
      >
        <FeatureCard
          icon={<Leaf className="text-accent" />}
          title="BERS 精準評級"
          desc="依據台灣綠建築評估手冊 (EEWH)，透過我們開發的 AI 引擎快速試算 EUI 指標，精準定位建築能效等級。"
          delay={0.1}
        />
        <FeatureCard
          icon={<Zap className="text-accent" />}
          title="深度能耗診斷"
          desc="超越表面分數。深入分析空調、照明與動力設備的用電結構，識別潛在的「吃電怪獸」與改善熱點。"
          delay={0.2}
        />
        <FeatureCard
          icon={<TrendingDown className="text-accent" />}
          title="提升方案導入"
          desc="極致的能源管理規劃。提供 EMS 能源管理系統、高效變頻設備汰換與綠電轉供建議，落實真正的節能。"
          delay={0.3}
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 20, delay } }
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <Card className="h-full p-10 bg-white/70 backdrop-blur-xl border border-white/60 hover:bg-white/90 hover:border-white transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative overflow-hidden rounded-[2rem] flex flex-col gap-6 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full gap-8">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed font-medium">{desc}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
