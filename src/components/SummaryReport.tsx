import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Activity, ShieldOff, LayoutDashboard, BarChart3,
    Download, ChevronDown, ChevronRight, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalculationResult } from "@/lib/types";

interface SummaryReportProps {
    result: CalculationResult;
    basic: any;
    collapsible?: boolean;
    defaultExpanded?: boolean;
}

export function SummaryReport({ result, basic, collapsible = false, defaultExpanded = true }: SummaryReportProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const content = (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
            {/* 一、建築物及空調基本資料 */}
            <ReportSection title="一、建築物及空調基本資料" icon={FileText} count={13}>
                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5 bg-zinc-900/20 backdrop-blur-sm">
                    <ReportRowG label="建築物名稱" value={basic.companyName} />
                    <ReportRowG label="建築物地址" value={basic.address} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
                        <ReportRowI label="總樓地板面積" value={basic.totalFloorArea} unit="m²" />
                        <ReportRowI label="評估樓地板面積" value={result.AFe} unit="m²" />
                        <ReportRowI label="地上總樓層數" value={basic.groundFloors} unit="層" />
                        <ReportRowI label="地下總樓層數" value={basic.basementFloors} unit="層" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5">
                        <ReportRowI label="實際年總耗電量" value={result.reliability.totalTE} unit="kWh/yr" />
                        <ReportRowI label="雨中水年利用量" value="-" unit="m³" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5">
                        <ReportRowI label="其他特殊用電" value="0" unit="kWh/yr" />
                        <ReportRowI label="城鄉係數" value={result.UR} unit="" />
                    </div>
                </div>
            </ReportSection>

            {/* 二、用電信賴度檢驗 */}
            <ReportSection title="二、用電信賴度檢驗" icon={Activity} count={3}>
                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5 bg-zinc-900/20 backdrop-blur-sm">
                    <div className="bg-zinc-900/50 p-4 flex justify-between items-center group">
                        <span className="text-zinc-400 text-sm">年總耗電量</span>
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-100 font-mono font-bold text-lg">{result.reliability.totalTE.toLocaleString()}</span>
                            <span className="text-zinc-600 text-xs">(kWh/yr)</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5">
                        <ReportRowReliability label="日平均用電量之最大月用電量變動率" valid={result.reliability.isMonthlyValid} value={result.reliability.monthlyMaxVariation} threshold="合格 < 50%" />
                        <ReportRowReliability label="日平均用電量之年變動率" valid={result.reliability.isYearlyValid} value={result.reliability.yearlyVariation} threshold="合格 < 15%" />
                    </div>
                </div>
            </ReportSection>

            {/* 三、BERSe免評估分區資料 */}
            <ReportSection title="三、BERSe免評估分區資料" icon={ShieldOff} count={result.exemptZoneDetails.length}>
                <div className="border border-white/10 rounded-xl overflow-hidden relative bg-zinc-900/20 backdrop-blur-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-800 text-zinc-400 text-xs uppercase font-bold tracking-widest border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">免評估分區</th>
                                <th className="px-6 py-4 text-center">面積 (m²)</th>
                                <th className="px-6 py-4 text-center">年耗電量計算公式 (kWh/yr)</th>
                                <th className="px-6 py-4 text-right">年耗電量 (kWh/yr)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {result.exemptZoneDetails.map((z, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-zinc-300 font-medium">{z.name}</td>
                                    <td className="px-6 py-4 text-center text-zinc-400 font-mono">{z.area}</td>
                                    <td className="px-6 py-4 text-center text-zinc-500 font-mono italic">{z.formula}</td>
                                    <td className="px-6 py-4 text-right text-zinc-200 font-bold font-mono">{z.energy.toLocaleString()}</td>
                                </tr>
                            ))}
                            {result.exemptZoneDetails.length === 0 && (
                                <tr><td colSpan={4} className="px-6 py-10 text-center text-zinc-600 text-sm italic">無免評估分區數據</td></tr>
                            )}
                        </tbody>
                        <tfoot className="bg-zinc-900/80 font-bold text-zinc-200 border-t border-white/10">
                            <tr>
                                <td className="px-6 py-4">免評估分區總面積</td>
                                <td className="px-6 py-4 text-center font-mono text-zinc-100">{result.AFn}</td>
                                <td className="px-6 py-4 text-center text-zinc-500">免評估分區總年耗電量</td>
                                <td className="px-6 py-4 text-right font-mono text-xl text-sky-400">{result.EN.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </ReportSection>

            {/* 四、BERSe耗能分區資料 */}
            <ReportSection title="四、BERSe耗能分區資料" icon={LayoutDashboard} count={result.energyZoneDetails.length}>
                <div className="border border-white/10 rounded-xl overflow-hidden relative bg-zinc-900/20 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-800 text-zinc-400 uppercase font-black tracking-widest border-b border-white/10 text-[10px]">
                                <tr>
                                    <th className="px-4 py-4 min-w-[120px]">耗能分區</th>
                                    <th className="px-4 py-4 text-center">面積 (m²)</th>
                                    <th className="px-4 py-4 text-center">AEUIm</th>
                                    <th className="px-4 py-4 text-center">LEUIm</th>
                                    <th className="px-4 py-4 text-center">EEUIm</th>
                                    <th className="px-4 py-4 text-center">城鄉數 UR</th>
                                    <th className="px-4 py-4 text-center">空間營運率</th>
                                    <th className="px-4 py-4 text-right">年耗電量</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {result.energyZoneDetails.map((z, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-zinc-300 font-bold">{z.name}</td>
                                        <td className="px-4 py-3 text-center text-zinc-400 font-mono">{z.area}</td>
                                        <td className="px-4 py-3 text-center text-zinc-500 font-mono">{z.aeui}</td>
                                        <td className="px-4 py-3 text-center text-zinc-500 font-mono">{z.leui}</td>
                                        <td className="px-4 py-3 text-center text-zinc-500 font-mono">{z.eeui}</td>
                                        <td className="px-4 py-3 text-center text-zinc-500 font-mono">{z.ur}</td>
                                        <td className="px-4 py-3 text-center text-zinc-500 font-mono">{z.sori}</td>
                                        <td className="px-4 py-3 text-right text-zinc-200 font-bold font-mono">{z.energy.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-zinc-900 font-bold text-zinc-200 border-t border-white/10">
                                <tr>
                                    <td className="px-4 py-2">耗能分區總年耗電量</td>
                                    <td colSpan={7} className="px-4 py-2 text-right font-mono text-zinc-100">{(result.energyZoneDetails.reduce((s, z) => s + z.energy, 0)).toFixed(0)} kWh/yr</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 divide-y divide-white/5">
                        <ReportSummaryItem label="實際年總耗電量" value={result.reliability.totalTE} unit="kWh/yr" />
                        <ReportSummaryItem label="輸送設備年耗電量 (Et)" value={result.Et} unit="kWh/yr" />
                        <ReportSummaryItem label="揚水設備年耗電量 (Ep)" value={result.Ep} unit="kWh/yr" />
                        <ReportSummaryItem label="加熱設備年耗電量 (Eh)" value={result.Eh} unit="kWh/yr" />
                        <ReportSummaryItem label="其他特殊用電量 (Ee)" value="0" unit="kWh/yr" />
                    </div>
                    <div className="bg-sky-500/5 border border-sky-500/10 rounded-xl p-4 flex flex-col justify-center gap-4">
                        <div className="flex justify-between items-center group">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">總耗電密度 TEUI</span>
                            <span className="text-zinc-100 font-mono font-black text-2xl group-hover:text-sky-400 transition-colors">{result.teui} <span className="text-[10px] text-zinc-600 ml-1">kWh/(m².yr)</span></span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">主設備用電密度 EUI'</span>
                            <span className="text-zinc-100 font-mono font-black text-2xl group-hover:text-sky-400 transition-colors">{result.euiPrime} <span className="text-[10px] text-zinc-600 ml-1">kWh/(m².yr)</span></span>
                        </div>
                    </div>
                </div>
            </ReportSection>

            {/* 五、能效指標 */}
            <ReportSection title="五、能效指標" icon={BarChart3} count={7}>
                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 shadow-2xl shadow-black/50 bg-zinc-900/20 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/10">
                        <ReportRowI label="EUI 最小值" value={result.benchmarks.min} unit="kWh/(m².yr)" />
                        <ReportRowI label="EUI GB 基準值" value={result.benchmarks.g} unit="kWh/(m².yr)" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/10">
                        <ReportRowI label="EUI 中位值" value={result.benchmarks.m} unit="kWh/(m².yr)" />
                        <ReportRowI label="EUI 最大值" value={result.benchmarks.max} unit="kWh/(m².yr)" />
                    </div>
                    <ReportRowLarge label="耗電密度差距 ΔEUI" value={result.deltaEui} unit="kWh/(m².yr)" detail="EUI' − SOR加權標準值" />
                    <ReportRowLarge label="耗電密度指標 EUI*" value={result.euiAdj} unit="kWh/(m².yr)" detail="EUIm + ΔEUI" />
                    <ReportRowLarge label="碳排密度指標 CEI*" value={(result.euiAdj * 0.495).toFixed(2)} unit="kgCO2/(m².yr)" detail="EUI* × 0.495" />
                    <div className="bg-zinc-900/80 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">能效得分計算</span>
                            <div className="flex items-end gap-2">
                                <span className="text-7xl font-black text-white leading-none tracking-tighter">{Math.round(result.score)}</span>
                                <span className="text-zinc-600 font-bold mb-2">分 / 100</span>
                            </div>
                        </div>
                        <div className="h-24 w-[1px] bg-white/10 hidden md:block" />
                        <div className="flex-1 text-right">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-right">能效等級判定</span>
                            <div className="flex flex-col items-end">
                                <span className="text-7xl font-black text-emerald-400 leading-none tracking-tighter group-hover:scale-110 transition-transform">{result.grade} 級</span>
                                <span className="text-emerald-500/50 font-black text-xl italic uppercase tracking-widest mt-1">Status: Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </ReportSection>
        </div>
    );

    if (!collapsible) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">BERSe 評估總表</h1>
                        <p className="text-zinc-500 text-sm mt-1">建築能效評估完整數據報告 — {basic.companyName}</p>
                    </div>
                    <Button className="h-10 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20"><Download size={16} className="mr-2" /> 下載報告</Button>
                </div>
                {content}
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-8 py-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-black text-white tracking-widest uppercase italic">BERSe評估總表</h2>
                        <p className="text-xs text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">Detailed Energy Efficiency Performance Report</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Current Rating</span>
                        <span className="text-2xl font-black text-sky-400 italic">{result.grade} Class</span>
                    </div>
                    <div className={`p-2 rounded-full bg-white/5 text-zinc-500 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 py-10 border-t border-white/5">
                            <div className="flex justify-end mb-8">
                                <Button size="sm" className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] shadow-lg shadow-sky-600/20 uppercase tracking-widest">
                                    <Download size={14} className="mr-2" /> Export PDF
                                </Button>
                            </div>
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper components moved inside or exported as needed
function ReportSection({ title, icon: Icon, count, children }: { title: string, icon: any, count: number, children: React.ReactNode }) {
    return (
        <div className="space-y-4 group/section">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-zinc-400 group-hover/section:text-sky-400 group-hover/section:bg-sky-500/10 transition-all duration-300">
                    <Icon size={18} />
                </div>
                <h2 className="text-base font-black text-zinc-300 group-hover/section:text-white transition-colors tracking-tight uppercase tracking-widest italic">{title}</h2>
                <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-zinc-600">({count})</span>
            </div>
            {children}
        </div>
    );
}

function ReportRowG({ label, value }: { label: string, value: string }) {
    return (
        <div className="grid grid-cols-[200px_1fr] bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors border-b border-white/5 last:border-0">
            <div className="py-4 px-6 text-zinc-500 text-xs font-black uppercase tracking-widest border-r border-white/5 bg-zinc-800/10 flex items-center">{label}</div>
            <div className="py-4 px-6 text-zinc-200 text-base font-medium">{value || "-"}</div>
        </div>
    );
}

function ReportRowI({ label, value, unit }: { label: string, value: any, unit: string }) {
    return (
        <div className="flex flex-col p-6 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors border-r border-white/5 last:border-r-0">
            <span className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.2em] mb-2">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-zinc-100 font-mono font-black text-2xl">{value || "0"}</span>
                <span className="text-zinc-600 text-xs font-bold uppercase">{unit}</span>
            </div>
        </div>
    );
}

function ReportRowReliability({ label, valid, value, threshold }: { label: string, valid: boolean, value: number, threshold: string }) {
    const pct = (value * 100).toFixed(1) + "%";
    return (
        <div className="p-6 flex flex-col gap-4 group/rel transition-colors hover:bg-white/[0.02]">
            <div className="flex justify-between items-start">
                <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-[280px]">{label}</p>
                <div className="text-right">
                    <div className={`text-3xl font-mono font-black italic ${valid ? 'text-sky-400' : 'text-red-400'}`}>{pct}</div>
                    <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">{threshold}</div>
                </div>
            </div>
            <div className="flex items-center gap-6 mt-1">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm bg-zinc-800 border-2 transition-all ${valid ? 'bg-sky-500 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'border-zinc-700'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${valid ? 'text-sky-400' : 'text-zinc-600'}`}>Verified</span>
                </div>
                <div className="flex items-center gap-2 px-3 border-l border-white/10">
                    <div className={`w-3 h-3 rounded-sm bg-zinc-800 border-2 transition-all ${!valid ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-zinc-700'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${!valid ? 'text-red-400' : 'text-zinc-600'}`}>Rejected</span>
                </div>
            </div>
        </div>
    );
}

function ReportRowLarge({ label, value, unit, detail }: { label: string, value: any, unit: string, detail: string }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-x divide-white/10 group/row hover:bg-zinc-800/50 transition-all">
            <div className="p-6 flex flex-col justify-center bg-zinc-800/10">
                <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div className="p-6 flex items-center justify-center">
                <span className="text-5xl font-black text-white font-mono italic group-hover/row:scale-105 transition-transform">{value} <span className="text-sm text-zinc-600 font-normal tracking-normal ml-2">{unit}</span></span>
            </div>
            <div className="p-6 flex flex-col justify-center items-end bg-zinc-800/5">
                <span className="text-zinc-600 text-[9px] font-mono italic uppercase tracking-tighter">{detail}</span>
            </div>
        </div>
    );
}

function ReportSummaryItem({ label, value, unit }: { label: string, value: any, unit: string }) {
    return (
        <div className="py-4 px-3 flex justify-between items-center group/item hover:bg-white/[0.02] transition-colors rounded-lg">
            <span className="text-zinc-500 text-xs font-bold group-hover/item:text-zinc-200 transition-colors uppercase tracking-widest">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-zinc-100 font-mono font-black text-base tabular-nums">{value === "-" ? "-" : Number(value).toLocaleString()}</span>
                <span className="text-zinc-700 text-xs font-bold uppercase tracking-tighter">{unit}</span>
            </div>
        </div>
    );
}
