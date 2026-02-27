"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, Zap, LayoutDashboard, Settings2, Droplets, Activity, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const steps = [
    { id: "basic", label: "基本資料", icon: Building2 },
    { id: "energy", label: "用電資料", icon: Zap },
    { id: "spaces", label: "空間面積", icon: LayoutDashboard },
    { id: "equipment", label: "設備資料", icon: Settings2 },
    { id: "water", label: "用水資料", icon: Droplets },
    { id: "operation", label: "營運率", icon: Activity },
];

export default function AssessmentPage() {
    const [activeTab, setActiveTab] = useState("basic");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [basicInfo, setBasicInfo] = useState({
        companyName: "", buildingType: "", contactPerson: "", contactEmail: "", phone: "", floorArea: "", groundFloors: "", basementFloors: "", address: ""
    });

    const [spaces, setSpaces] = useState([
        { id: 1, name: "", type: "", acUsage: "", isWaterCooled: "no", area: "" }
    ]);

    const currentIndex = steps.findIndex(s => s.id === activeTab);
    const handleNext = () => { if (currentIndex < steps.length - 1) setActiveTab(steps[currentIndex + 1].id); };
    const handlePrev = () => { if (currentIndex > 0) setActiveTab(steps[currentIndex - 1].id); };

    const handleComplete = async () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            window.location.href = "/dashboard";
        }, 1500);
    };

    const addSpace = () => setSpaces([...spaces, { id: Date.now(), name: "", type: "", acUsage: "", isWaterCooled: "no", area: "" }]);
    const removeSpace = (id: number) => setSpaces(spaces.filter(s => s.id !== id));

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary/20">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                <h1 className="text-4xl md:text-[3.5rem] font-bold tracking-tighter text-foreground mb-6 text-center">
                    BERS 智慧建築能效評估
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium text-center mb-16">
                    請填寫以下建築基本資訊與設備數據，我們的 AI 引擎將為您即時計算並生成專屬的能效診斷報告。
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto px-6 md:px-12 items-start relative z-10 pb-20">

                {/* Left Side Navigation Pill */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-64 shrink-0">
                    <Card className="bg-white/50 backdrop-blur-xl border border-white/60 ring-1 ring-slate-900/5 p-2 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col gap-1 overflow-hidden relative">
                        {steps.map((step, idx) => {
                            const isActive = activeTab === step.id;
                            const Icon = step.icon;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveTab(step.id)}
                                    className={`relative flex items-center gap-4 px-6 py-4 rounded-xl font-semibold transition-all duration-300 z-10 w-full text-left overflow-hidden
                    ${isActive ? "text-primary-foreground shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]" : "text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-primary z-[-1]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={20} className={isActive ? "text-primary-foreground" : "text-slate-400"} />
                                    <span className="text-sm tracking-wide">{step.label}</span>
                                </button>
                            );
                        })}
                    </Card>
                </motion.div>

                {/* Right Side Content Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full flex-1 min-w-0">
                    <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.02)] ring-1 ring-slate-900/5 rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none" />
                        <div className="p-8 md:p-12 flex-1 relative z-10">
                            <AnimatePresence mode="wait">

                                {/* 1. 基本資料 */}
                                {activeTab === "basic" && (
                                    <motion.div key="basic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">基本資料</h2>
                                            <p className="text-muted-foreground font-medium">我們需要您的基本聯繫方式與建築概況以建立評估檔案。</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">公司名稱</Label><Input className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">建築類型</Label>
                                                <Select><SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none"><SelectValue placeholder="選擇類型" /></SelectTrigger>
                                                    <SelectContent className="rounded-xl"><SelectItem value="office">辦公場所</SelectItem><SelectItem value="hotel">旅館</SelectItem><SelectItem value="hospital">醫療照護</SelectItem></SelectContent></Select>
                                            </div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">填寫人員</Label><Input className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">聯繫信箱</Label><Input type="email" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">電話</Label><Input type="tel" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">樓地板面積 (m²)</Label><Input type="number" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">地上總樓層數</Label><Input type="number" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">地下總樓層數</Label><Input type="number" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                            <div className="space-y-4 md:col-span-2"><Label className="text-sm font-semibold text-slate-700 tracking-wide">地址</Label><Input className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none" /></div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 2. 用電資料 */}
                                {activeTab === "energy" && (
                                    <motion.div key="energy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                        <div><h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">用電資料</h2><p className="text-muted-foreground font-medium">輸入連續 12 個月的電費單數據以建立能效基準。</p></div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">比對年度 1</Label><Select><SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none"><SelectValue placeholder="2024" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="2024">2024</SelectItem></SelectContent></Select></div>
                                            <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">比對年度 2</Label><Select><SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 px-6 transition-all shadow-none"><SelectValue placeholder="2023" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="2023">2023</SelectItem></SelectContent></Select></div>
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {[1, 2, 3, 4, 5, 6].map(month => (
                                                    <div key={month} className="flex gap-4 items-center">
                                                        <Label className="w-12 text-slate-600 font-bold">{month}月</Label>
                                                        <Input placeholder={`年度1 kWh`} className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" />
                                                        <Input placeholder={`年度2 kWh`} className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 3. 空間面積 */}
                                {activeTab === "spaces" && (
                                    <motion.div key="spaces" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div><h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">空間面積資料</h2><p className="text-muted-foreground font-medium">設定建築內部的各大空間，推估不同區域的標準耗能區間。</p></div>
                                            <Button onClick={addSpace} className="rounded-full shadow-sm border border-slate-200 bg-white text-primary hover:bg-slate-50 hover:text-primary/80 px-6 h-12 font-bold transition-all">
                                                <Plus className="w-4 h-4 mr-2" /> 新增空間
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {spaces.map((space, index) => (
                                                <div key={space.id} className="relative bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-6 group hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                                    <button onClick={() => removeSpace(space.id)} className="absolute top-6 right-6 text-slate-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
                                                    <div className="font-bold text-xl text-foreground flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">{index + 1}</div>
                                                        空間
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                                        <div className="space-y-3 col-span-2"><Label className="text-xs font-semibold text-slate-700 tracking-wide">空間名稱</Label><Input className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" placeholder="例如: 1F 大廳" /></div>
                                                        <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">類型</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="選擇" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="office">辦公空間</SelectItem><SelectItem value="lobby">商場</SelectItem></SelectContent></Select></div>
                                                        <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">空調使情形</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="選擇" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="1">間歇</SelectItem><SelectItem value="2">整日</SelectItem></SelectContent></Select></div>
                                                        <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">面積 (m²)</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" placeholder="500" /></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* 4. 設備資料 */}
                                {activeTab === "equipment" && (
                                    <motion.div key="equipment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                        <div><h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">設備資料</h2><p className="text-muted-foreground font-medium">設定空調、照明等主要耗能設備規格。</p></div>

                                        <div className="grid gap-6">
                                            <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary"><Settings2 size={20} /></div> 空調設備
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">設備類型</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="選取" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="central">中央空調</SelectItem><SelectItem value="vrv">VRV</SelectItem></SelectContent></Select></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">總噸數 (RT)</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">數量</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">使用時數 (hr/yr)</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                </div>
                                            </div>

                                            <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-accent/10 text-accent"><Zap size={20} /></div> 照明設備
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">燈具類型</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="選取" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="led">LED</SelectItem><SelectItem value="t5">T5 日光燈</SelectItem></SelectContent></Select></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">數量</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">年份</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">使用時數 (hr/yr)</Label><Input type="number" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 5. 用水資料 */}
                                {activeTab === "water" && (
                                    <motion.div key="water" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                        <div><h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">用水資料</h2><p className="text-muted-foreground font-medium">揚水系統與用水相關數據。</p></div>
                                        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                            <h3 className="text-xl font-bold flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">💦</div> 揚水系統
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">水塔高度 (m)</Label><Input type="number" placeholder="42" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none px-6" /></div>
                                                <div className="space-y-4"><Label className="text-sm font-semibold text-slate-700 tracking-wide">年用水量 (m³/yr)</Label><Input type="number" placeholder="221.4" className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none px-6" /></div>
                                                <div className="space-y-4 md:col-span-2"><Label className="text-sm font-semibold text-slate-700 tracking-wide">熱水設備類型</Label>
                                                    <Select><SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none px-6"><SelectValue placeholder="選擇類別" /></SelectTrigger>
                                                        <SelectContent className="rounded-xl"><SelectItem value="1">電熱式</SelectItem><SelectItem value="2">瓦斯式</SelectItem><SelectItem value="3">熱泵</SelectItem></SelectContent></Select>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 6. 營運率 */}
                                {activeTab === "operation" && (
                                    <motion.div key="operation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                        <div><h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">營運率 (Operation Rate)</h2><p className="text-muted-foreground font-medium">建築物與各特定區域的營運時間。</p></div>

                                        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500 mb-8">
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">建築營運時間</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                                <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">起始日</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="星期一" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="1">星期一</SelectItem></SelectContent></Select></div>
                                                <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">結束日</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="星期五" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="5">星期五</SelectItem></SelectContent></Select></div>
                                                <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">開始時間</Label><Input type="time" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">結束時間</Label><Input type="time" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 p-4 rounded-xl border border-transparent transition-colors duration-300">
                                                <Checkbox id="allday" className="rounded-md w-5 h-5 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                                <label htmlFor="allday" className="text-sm font-semibold leading-none cursor-pointer text-slate-700">
                                                    整日營運 (24hr)
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                                <h3 className="font-bold mb-6 text-lg">特定區域營運率</h3>
                                                <div className="space-y-6">
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">展覽區</Label><Input type="number" step="0.1" placeholder="0.5" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">200人以上大會議室</Label><Input type="number" step="0.1" placeholder="0.6" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">一般空調區域</Label><Input type="number" step="0.1" placeholder="0.8" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                </div>
                                            </div>
                                            <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 ring-1 ring-slate-900/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-500">
                                                <h3 className="font-bold mb-6 text-lg">特定營運空間</h3>
                                                <div className="space-y-6">
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">盥洗室營運時間 (h/yr)</Label><Input type="number" placeholder="2500" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">餐廳形式</Label><Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none"><SelectValue placeholder="無" /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="0">無</SelectItem><SelectItem value="1">員工餐廳</SelectItem></SelectContent></Select></div>
                                                    <div className="space-y-3"><Label className="text-xs font-semibold text-slate-700 tracking-wide">餐廳面積 (m²)</Label><Input type="number" placeholder="0" className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-none" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Bottom Actions Area */}
                        <div className="p-4 md:px-8 md:py-4 bg-slate-50/80 backdrop-blur-md border-t border-slate-200 mt-auto flex justify-between items-center rounded-b-[2rem] relative z-10">
                            <Button
                                variant="ghost"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="h-11 px-5 rounded-full hover:bg-slate-200 font-bold text-slate-500 hover:text-slate-900 transition-all text-sm"
                            >
                                <ArrowLeft className="mr-2 w-4 h-4" /> 返回
                            </Button>

                            {currentIndex === steps.length - 1 ? (
                                <Button
                                    onClick={handleComplete}
                                    disabled={isSubmitting}
                                    className="h-11 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-[0_4px_20px_rgba(13,148,136,0.3)] transition-all"
                                >
                                    {isSubmitting ? "處理中..." : <><Save className="mr-2 w-4 h-4" /> 產出報告</>}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className="h-11 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-sm transition-all"
                                >
                                    下一步 <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
