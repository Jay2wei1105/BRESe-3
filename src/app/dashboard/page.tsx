"use client";

import { motion } from "framer-motion";
import {
    Activity, Zap, Leaf, Droplets, Target, TrendingUp, TrendingDown, Settings2, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

// --- Mock Data ---

const monthlyConsumptionData = [
    { name: 'Jan', actual: 48000, baseline: 52000 },
    { name: 'Feb', actual: 45000, baseline: 49000 },
    { name: 'Mar', actual: 58000, baseline: 55000 },
    { name: 'Apr', actual: 61000, baseline: 65000 },
    { name: 'May', actual: 72000, baseline: 70000 },
    { name: 'Jun', actual: 85000, baseline: 88000 },
    { name: 'Jul', actual: 92000, baseline: 95000 },
    { name: 'Aug', actual: 95000, baseline: 98000 },
    { name: 'Sep', actual: 82000, baseline: 85000 },
    { name: 'Oct', actual: 65000, baseline: 68000 },
    { name: 'Nov', actual: 52000, baseline: 55000 },
    { name: 'Dec', actual: 49000, baseline: 51000 },
];

const peakDemandData = [
    { day: 'Mon', kw: 280, capacity: 350 },
    { day: 'Tue', kw: 310, capacity: 350 },
    { day: 'Wed', kw: 295, capacity: 350 },
    { day: 'Thu', kw: 340, capacity: 350 },
    { day: 'Fri', kw: 360, capacity: 350 },
    { day: 'Sat', kw: 180, capacity: 350 },
    { day: 'Sun', kw: 150, capacity: 350 },
];

const equipmentUsageData = [
    { name: 'HVAC', value: 55, color: '#0ea5e9' },    // sky-500
    { name: 'Lighting', value: 20, color: '#14b8a6' }, // teal-500
    { name: 'Plugs/Misc', value: 15, color: '#8b5cf6' }, // violet-500
    { name: 'Elevators', value: 10, color: '#64748b' },  // slate-500
];

const topConsumers = [
    { rank: 1, name: "Chiller Plant A", kwh: 12500, percent: 35 },
    { rank: 2, name: "AHU-Level 1-3", kwh: 4200, percent: 12 },
    { rank: 3, name: "Lighting-Lobby", kwh: 2800, percent: 8 },
    { rank: 4, name: "Data Center Cooling", kwh: 1900, percent: 5 },
    { rank: 5, name: "Elevator Bank A", kwh: 1200, percent: 3 },
];

export default function DashboardPage() {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
    };

    // Custom tooltips for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-xl">
                    <p className="text-zinc-300 font-medium mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-zinc-400">{entry.name}:</span>
                            <span className="font-mono text-zinc-100">{entry.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex-1 flex flex-col pt-8 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full space-y-6">

                {/* 1. Overview Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Metric 1 */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                            <CardContent className="p-5 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-zinc-400">Total Consumption</div>
                                    <Zap className="text-sky-400/50" size={16} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-zinc-100">804,000 <span className="text-xs text-zinc-500 font-sans">kWh</span></div>
                                    <div className="text-xs text-emerald-400 flex items-center mt-1"><TrendingDown size={12} className="mr-1" /> 11% vs Baseline</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Metric 2 */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                            <CardContent className="p-5 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-zinc-400">Energy Cost</div>
                                    <BarChart3 className="text-teal-400/50" size={16} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-zinc-100">$2.4M <span className="text-xs text-zinc-500 font-sans">NTD</span></div>
                                    <div className="text-xs text-emerald-400 flex items-center mt-1"><TrendingDown size={12} className="mr-1" /> 8.5% vs Last Year</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Metric 3 */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                            <CardContent className="p-5 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-zinc-400">Energy Use Intensity</div>
                                    <Activity className="text-violet-400/50" size={16} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-zinc-100">85 <span className="text-xs text-zinc-500 font-sans">kWh/m²</span></div>
                                    <div className="text-xs text-emerald-400 flex items-center mt-1">Excellent (Target: 140)</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Metric 4 */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                            <CardContent className="p-5 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-zinc-400">Water Use Intensity</div>
                                    <Droplets className="text-blue-400/50" size={16} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-zinc-100">0.85 <span className="text-xs text-zinc-500 font-sans">m³/m²</span></div>
                                    <div className="text-xs text-rose-400 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> 4% above average</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Metric 5 */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                            <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-zinc-400">BERS Rating</div>
                                    <Leaf className="text-emerald-400" size={16} />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400">1+</div>
                                    <div className="text-xs text-emerald-300 font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">Diamond Level</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Consumption Chart (Span 2) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card className="h-full bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-zinc-200">Consumption vs Baseline (Monthly)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value / 1000}k`} />
                                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                                            <Legend wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
                                            <Bar dataKey="actual" name="Actual Usage" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Bar dataKey="baseline" name="Baseline" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={20} opacity={0.6} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Breakdown & Ranking (Span 1) */}
                    <div className="flex flex-col gap-6">
                        {/* Donut Chart */}
                        <motion.div variants={itemVariants}>
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                                <CardHeader className="pb-0">
                                    <CardTitle className="text-base font-medium text-zinc-200">System Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="h-[160px] w-full flex items-center relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={equipmentUsageData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={70}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {equipmentUsageData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        {/* Legend on the right manually crafted to look like Diamo */}
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 w-[120px]">
                                            {equipmentUsageData.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                        {item.name}
                                                    </div>
                                                    <span className="text-zinc-200 font-mono">{item.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Top Consumers List */}
                        <motion.div variants={itemVariants} className="flex-1">
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors h-full">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-medium text-zinc-200">Top Energy Consumers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topConsumers.map((item) => (
                                            <div key={item.rank} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 flex items-center justify-center">
                                                        {item.rank}
                                                    </div>
                                                    <div className="text-sm text-zinc-300">{item.name}</div>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs w-1/3 justify-end">
                                                    <span className="text-zinc-500 hidden sm:inline-block">${(item.kwh * 3).toLocaleString()}</span>
                                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden max-w-[60px]">
                                                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${item.percent}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Section: Area Chart */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-colors">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-medium text-zinc-200">Peak Demand Analysis (Current Week)</CardTitle>
                            <div className="text-xs text-zinc-500 flex items-center gap-4">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500" /> Actual Demand</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-teal-500/50" /> Contract Capacity</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={peakDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="kw" name="Peak kW" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorKw)" />
                                        <Area type="step" dataKey="capacity" name="Contract kW" stroke="#14b8a6" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

            </motion.div>
        </div>
    );
}
