import { euiTable, Region } from './eui-table';
import { cityRegions } from './city-regions';
import { AssessmentInput, CalculationResult } from './types';

const countyToRegion: Record<string, Region> = {
    '基隆市': 'north', '臺北市': 'north', '新北市': 'north', '桃園市': 'north',
    '新竹市': 'north', '新竹縣': 'north', '宜蘭縣': 'north', '花蓮縣': 'north',
    '金門縣': 'north', '連江縣': 'north',
    '苗栗縣': 'central', '臺中市': 'central', '彰化縣': 'central', '南投縣': 'central', '雲林縣': 'central',
    '嘉義市': 'south', '嘉義縣': 'south', '臺南市': 'south', '高雄市': 'south', '屏東縣': 'south',
    '臺東縣': 'south', '澎湖縣': 'south'
};

export function calculateBERSe(input: AssessmentInput): CalculationResult {
    const { location, energyZones, exemptZones, totalElectricityTE, equipment, otherSpecialPowerEe } = input;

    // 1. Get UR value and Region
    const cityData = (cityRegions as any)[location];
    const ur = cityData ? cityData.urValue : 1;
    const region = cityData ? (countyToRegion[cityData.county] || 'north') : 'north';

    // 2. Calculate Energy Zone Weighted Benchmarks
    let totalAfe = 0;
    let aeuiMinSum = 0;
    let aeuiMSum = 0;
    let aeuiMaxSum = 0;
    let leuiMinSum = 0;
    let leuiMSum = 0;
    let leuiMaxSum = 0;
    let eeuiSum = 0;
    let soriWeightedSum = 0;

    energyZones.forEach(zone => {
        const tableData = (euiTable as any)[zone.code];
        if (!tableData) return;

        const afe = zone.area;
        totalAfe += afe;

        const p = tableData.params;
        const isInt = zone.isIntermittent;

        // AEUI (Region sensitive)
        aeuiMinSum += (isInt ? p.min.aeui_intermittent[region] : p.min.aeui_full[region]) * afe;
        aeuiMSum += (isInt ? p.m.aeui_intermittent[region] : p.m.aeui_full[region]) * afe;
        aeuiMaxSum += (isInt ? p.max.aeui_intermittent[region] : p.max.aeui_full[region]) * afe;

        // LEUI
        leuiMinSum += p.min.leui * afe;
        leuiMSum += p.m.leui * afe;
        leuiMaxSum += p.max.leui * afe;

        // EEUI (Standard BERS uses median value for benchmark consistency)
        eeuiSum += p.m.eeui * afe;

        // SORi
        soriWeightedSum += (tableData.sori || 1) * afe;
    });

    if (totalAfe === 0) return { teui: 0, euiAdj: 0, score: 0, grade: 'N/A', benchmarks: { min: 0, g: 0, max: 0 } };

    const avgAeuiMin = aeuiMinSum / totalAfe;
    const avgAeuiM = aeuiMSum / totalAfe;
    const avgAeuiMax = aeuiMaxSum / totalAfe;
    const avgLeuiMin = leuiMinSum / totalAfe;
    const avgLeuiM = leuiMSum / totalAfe;
    const avgLeuiMax = leuiMaxSum / totalAfe;
    const avgEeui = eeuiSum / totalAfe;
    const avgSori = soriWeightedSum / totalAfe;

    // 3. Benchmarks
    const euiMin = ur * (avgAeuiMin + avgLeuiMin + avgEeui);
    const euiG = ur * (avgAeuiM + avgLeuiM + avgEeui);
    const euiMax = ur * (avgAeuiMax + avgLeuiMax + avgEeui);

    // 4. Exempt Zones EN
    const totalEnk = exemptZones.reduce((sum, zone) => {
        // simplified lookup for now, in real app would use exemptEuiTable
        return sum; // Placeholder, assuming EN is handled by inputs or manual entry
    }, 0);
    const EN = totalEnk; // In the form, user might input EN directly per zone

    // 5. Calculate EUI' (Actual Building Adjusted)
    // EUI’ = [TE – UR × (EN + Et + Ep + Eh) – Ee] / Afe
    const equipmentTotal = equipment.elevators + equipment.pumps + equipment.heating;
    const euiActual = (totalElectricityTE - ur * (EN + equipmentTotal) - otherSpecialPowerEe) / totalAfe;

    // 6. Correction for SORi and Final EUI Adjustment
    // G54 (Correction) = G50 - F8 * Σ(EUI_base_i * SOR_i * Afi) / Afe
    // This correction is subtle - it accounts for buildings operating fewer hours than standard
    const standardEuiWithSori = ur * ((avgAeuiM + avgLeuiM + avgEeui) * avgSori);
    // G55 (Final Adjusted) = EUIg + (EUI' - StandardEuiWithSori)
    const euiFinalAdj = euiG + (euiActual - standardEuiWithSori);

    // 7. Score Calculation
    let score = 0;
    if (euiFinalAdj <= euiG) {
        score = 50 + 50 * (euiG - euiFinalAdj) / (euiG - euiMin);
    } else {
        score = 50 * (euiMax - euiFinalAdj) / (euiMax - euiG);
    }
    score = Math.max(0, Math.min(100, score));

    // 8. Grade Assignment
    let grade = '7';
    if (score >= 90) grade = '1+';
    else if (score >= 80) grade = '1';
    else if (score >= 70) grade = '2';
    else if (score >= 60) grade = '3';
    else if (score >= 50) grade = '4';
    else if (score >= 40) grade = '5';
    else if (score >= 20) grade = '6';

    return {
        teui: totalElectricityTE / (totalAfe + (exemptZones.reduce((s, z) => s + z.area, 0))),
        euiAdj: euiFinalAdj,
        score: Math.round(score * 100) / 100,
        grade,
        benchmarks: {
            min: Math.round(euiMin * 100) / 100,
            g: Math.round(euiG * 100) / 100,
            max: Math.round(euiMax * 100) / 100
        }
    };
}
