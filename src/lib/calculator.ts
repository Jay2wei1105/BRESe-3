/**
 * calculator.ts — BERSe 能效計算核心
 *
 * 公式對照來源：建築能效計算表單.xlsm / BERSe評估總表
 *
 * 主要公式（對照 Excel 儲存格）：
 *   Et  (免評估設備!F1)  = 電梯耗電 × Or + 電扶梯耗電 × Osr
 *   Ep  (免評估設備!F11) = 0.02 × (HP1+6) × (Qw + Qaw - Qrw)
 *   Eh  (免評估設備!F26) = H1 × Qhw + H2 × Qshw   (H1/H2 依熱水設備類型)
 *   EUI' (G50)           = [TE – UR×(EN+Et+Ep+Eh) – Ee] / AFe
 *   EUImin (C52)         = UR × (AEUImin + LEUImin + EEUIi)   [面積加權]
 *   EUIg (G52)           = UR × (0.8×AEUIm + 0.8×LEUIm + EEUIi)  ← GB基準
 *   EUIm (C53)           = UR × (AEUIm + LEUIm + EEUIi)
 *   EUImax (G53)         = UR × (AEUImax + LEUImax + EEUIi)
 *   △EUI (G54)           = EUI' – UR × Σ(AEUIm+LEUIm+EEUIi)×SORi×Afi / AFe
 *   EUI* (G55)           = EUIm + △EUI
 *   SCORE (G57)          = IF(EUI*≤EUIg, 50+50×(EUIg-EUI*)/(EUIg-EUImin),
 *                                         50×(EUImax-EUI*)/(EUImax-EUIg))
 *   等級 (G58)            = 1+(≥90)/1(≥80)/2(≥70)/3(≥60)/4(≥50)/5(≥40)/6(≥20)/7
 */

import { euiTable, Region } from './eui-table';
import { cityRegions } from './city-regions';
import { equipmentRates } from './equipment-rates';
import { AssessmentInput, CalculationResult } from './types';

// ─── 城市 → 地區對應（供找 AEUI 北/中/南 欄） ─────────────────────────────────
const countyToRegion: Record<string, Region> = {
    '基隆市': 'north', '臺北市': 'north', '新北市': 'north', '桃園市': 'north',
    '新竹市': 'north', '新竹縣': 'north', '宜蘭縣': 'north', '花蓮縣': 'north',
    '金門縣': 'north', '連江縣': 'north',
    '苗栗縣': 'central', '臺中市': 'central', '彰化縣': 'central',
    '南投縣': 'central', '雲林縣': 'central',
    '嘉義市': 'south', '嘉義縣': 'south', '臺南市': 'south',
    '高雄市': 'south', '屏東縣': 'south', '臺東縣': 'south', '澎湖縣': 'south',
};

// ─── Et 電梯耗電計算 ─────────────────────────────────────────────────────────
// 來源：填表!U3 公式
//   Uel = R × P × Q × 0.05/860 × EEel_factor × T
//   EEel_factor: 變頻電力回收=0.5 / 變頻=0.7 / 普通=1.0
// Or (電梯營運率) 由建築分類查 equipmentRates
function calcEt(elevators: AssessmentInput['elevators'], buildingType: string): number {
    const rates = (equipmentRates as any)[buildingType];
    const Or = rates ? rates.or : 0.6; // 找不到時預設 0.6

    let totalEt = 0;
    for (const el of elevators) {
        // 效率係數
        const eeFactor = el.type === 'vfd_regen' ? 0.5 : el.type === 'vfd' ? 0.7 : 1.0;
        // 單台年耗電 (kWh)
        const unitEnergy = el.qty * el.load * el.speed * 0.05 / 860 * eeFactor * el.hours;
        totalEt += unitEnergy;
    }
    return totalEt * Or; // 乘上建築類型電梯營運率
}

// ─── Ep 揚水設備耗電計算 ─────────────────────────────────────────────────────
// 來源：免評估設備!F11
//   Ep = 0.02 × (HP1+6) × (Qw + Qaw - Qrw)
//   Qaw (水冷空調用水量) = 0.00036 × Σ(AEUIbase × Afi × 水冷旗標) + 0.32 × Σ(水冷Afi)
//   此處 Qaw 需要評估分區資訊才能計算，傳入 waterCooledArea 做近似
function calcEp(
    towerHeight: number,
    annualWaterUsage: number,
    waterCooledArea: number = 0,
    rainwaterRecovery: number = 0
): number {
    // Qaw 水冷空調估算（簡化：0.32 × 水冷面積，完整版需各分區 AEUI 資料）
    const Qaw = 0.32 * waterCooledArea;
    const Qw = annualWaterUsage;
    const Qrw = rainwaterRecovery;
    return 0.02 * (towerHeight + 6) * (Qw + Qaw - Qrw);
}

// ─── Eh 熱水系統耗電計算 ──────────────────────────────────────────────────────
// 來源：免評估設備!F26
//   Qhw = 10.2×NR×YOR + 12.8×NB×YOB + 0.023×Afw×YOH + Afi×YOD×餐飲係數
//   Eh = H1 × Qhw
//   H1: 電熱水器=45.1 / 熱泵=13.2
const restaurantCoeff: Record<string, number> = {
    one: 0.00284,
    two: 0.00568,
    three: 0.00852,
    '24h': 0.0284,
    none: 0,
};

function calcEh(input: AssessmentInput): number {
    const hw = input.hotWaterInput;
    if (!hw || hw.type === 'none') return 0;

    const H1 = hw.type === 'heatpump' ? 13.2 : 45.1; // kWh/m³

    // Qhw (m³/yr) 熱水加熱量
    const qHotel = 10.2 * (hw.hotelRooms || 0) * (hw.hotelOccupancy || 0);
    const qHosp = 12.8 * (hw.hospitalBeds || 0) * (hw.hospitalOccupancy || 0);
    const qToilet = 0.023 * (hw.toiletArea || 0) * (hw.toiletHours || 0);
    const restCoeff = restaurantCoeff[hw.restaurantServiceType || 'none'] || 0;
    const qRest = (hw.restaurantArea || 0) * (hw.restaurantDays || 0) * restCoeff;

    const Qhw = qHotel + qHosp + qToilet + qRest;
    return H1 * Qhw;
}

// ─── 主計算函式 ───────────────────────────────────────────────────────────────
export function calculateBERSe(input: AssessmentInput): CalculationResult {
    const {
        location, buildingType, energyZones, exemptZones,
        otherSpecialPowerEe, elevators = [], escalators = [],
        waterInput, hotWaterInput,
    } = input;

    // ── 1. 城鄉係數 UR ──
    const cityData = (cityRegions as any)[location];
    const ur = cityData ? cityData.urValue : 1;
    const region: Region = cityData
        ? (countyToRegion[cityData.county] || 'north')
        : 'north';

    // ── 2. 年總耗電量 TE（2年平均） ──
    const TE = input.totalElectricityTE_y2
        ? (input.totalElectricityTE + input.totalElectricityTE_y2) / 2
        : input.totalElectricityTE;

    // ── 3. 評估分區加權計算 ──
    let AFe = 0;
    let aeuiMinW = 0, aeuiMW = 0, aeuiMaxW = 0;
    let leuiMinW = 0, leuiMW = 0, leuiMaxW = 0;
    let eeuiW = 0;
    let soriW = 0;
    let waterCooledArea = 0;

    for (const zone of energyZones) {
        const td = (euiTable as any)[zone.code];
        if (!td) continue;
        const a = zone.area;
        const p = td.params;
        const isInt = zone.isIntermittent;
        AFe += a;

        // AEUI（分北/中/南）
        aeuiMinW += (isInt ? p.min.aeui_intermittent[region] : p.min.aeui_full[region]) * a;
        aeuiMW += (isInt ? p.m.aeui_intermittent[region] : p.m.aeui_full[region]) * a;
        aeuiMaxW += (isInt ? p.max.aeui_intermittent[region] : p.max.aeui_full[region]) * a;

        // LEUI
        leuiMinW += p.min.leui * a;
        leuiMW += p.m.leui * a;
        leuiMaxW += p.max.leui * a;

        // EEUI（用中位值）
        eeuiW += p.m.eeui * a;

        // SORi 空間營運率
        soriW += (td.sori || 1) * a;

        // 水冷面積（供 Ep 計算 Qaw 估算用）
        if (zone.isWaterCooled) waterCooledArea += a;
    }

    if (AFe === 0) {
        return { teui: 0, euiAdj: 0, euiPrime: 0, score: 0, grade: 'N/A', Et: 0, Ep: 0, Eh: 0, deltaEui: 0, benchmarks: { min: 0, g: 0, m: 0, max: 0 } };
    }

    const avgAeuiMin = aeuiMinW / AFe;
    const avgAeuiM = aeuiMW / AFe;
    const avgAeuiMax = aeuiMaxW / AFe;
    const avgLeuiMin = leuiMinW / AFe;
    const avgLeuiM = leuiMW / AFe;
    const avgLeuiMax = leuiMaxW / AFe;
    const avgEeui = eeuiW / AFe;
    const avgSori = soriW / AFe;

    // ── 4. 免評估分區 EN（暫以直接加總，完整版需查分區計算參數表） ──
    // TODO: 實作 exemptEuiTable 查表計算
    const AFn = exemptZones.reduce((s, z) => s + z.area, 0);
    const EN = 0; // 目前為 placeholder，需依分區代碼計算

    // ── 5. 設備耗電量計算 ──
    // Et — 電梯（來源：免評估設備!F1 公式）
    const Et = calcEt(elevators, buildingType);

    // Ep — 揚水（來源：免評估設備!F11 公式）
    const w = waterInput;
    const Ep = w
        ? calcEp(w.towerHeight, w.annualUsage, waterCooledArea, w.rainwaterRecovery || 0)
        : calcEp(0, input.waterUsage, waterCooledArea, 0);

    // Eh — 熱水（來源：免評估設備!F26 公式）
    const Eh = calcEh(input);

    // ── 6. 主設備耗電密度 EUI' (G50) ──
    // EUI' = [TE – UR×(EN + Et + Ep + Eh) – Ee] / AFe
    const EuiPrime = (TE - ur * (EN + Et + Ep + Eh) - otherSpecialPowerEe) / AFe;

    // ── 7. 基準值 ──
    // EUImin (C52) = UR × (AEUImin + LEUImin + EEUI)
    const euiMin = ur * (avgAeuiMin + avgLeuiMin + avgEeui);
    // EUIm  (C53) = UR × (AEUIm + LEUIm + EEUI)
    const euiM = ur * (avgAeuiM + avgLeuiM + avgEeui);
    // EUIg  (G52) = UR × (0.8×AEUIm + 0.8×LEUIm + EEUI)  ← GB基準，非中位值！
    const euiG = ur * (0.8 * avgAeuiM + 0.8 * avgLeuiM + avgEeui);
    // EUImax (G53) = UR × (AEUImax + LEUImax + EEUI)
    const euiMax = ur * (avgAeuiMax + avgLeuiMax + avgEeui);

    // ── 8. △EUI 和 EUI* (G54, G55) ──
    // △EUI = EUI' – UR × Σ(AEUIm+LEUIm+EEUI)×SORi×Afi / AFe
    const standardWithSori = ur * ((avgAeuiM + avgLeuiM + avgEeui) * avgSori);
    const deltaEui = EuiPrime - standardWithSori;
    const euiStar = euiM + deltaEui; // EUI* = EUIm + △EUI (G55)

    // ── 9. 能效得分 SCORE (G57) ──
    let score: number;
    if (euiStar <= euiG) {
        score = 50 + 50 * (euiG - euiStar) / (euiG - euiMin);
    } else {
        score = 50 * (euiMax - euiStar) / (euiMax - euiG);
    }
    score = Math.max(0, Math.min(100, score));

    // ── 10. 能效等級 (G58) ──
    let grade = '7';
    if (score >= 90) grade = '1+';
    else if (score >= 80) grade = '1';
    else if (score >= 70) grade = '2';
    else if (score >= 60) grade = '3';
    else if (score >= 50) grade = '4';
    else if (score >= 40) grade = '5';
    else if (score >= 20) grade = '6';

    // ── 11. TEUI 總耗電密度 (G49) ──
    const teui = TE / (AFe + AFn);

    return {
        teui: round2(teui),
        euiAdj: round2(euiStar),
        euiPrime: round2(EuiPrime),
        score: round2(score),
        grade,
        Et: round2(Et),
        Ep: round2(Ep),
        Eh: round2(Eh),
        deltaEui: round2(deltaEui),
        benchmarks: {
            min: round2(euiMin),
            g: round2(euiG),
            m: round2(euiM),
            max: round2(euiMax),
        },
    };
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}
