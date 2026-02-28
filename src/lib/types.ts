export interface AssessmentInput {
    buildingName: string;
    buildingAddress: string;
    location: string; // District full name for UR lookup
    totalFloorArea: number;
    floorsAbove: number;
    floorsBelow: number;
    buildingType: string; // e.g., "G-2"

    // Consumption
    totalElectricityTE: number; // kWh/yr
    otherSpecialPowerEe: number; // kWh/yr
    waterUsage: number; // m3

    // Zones
    energyZones: Array<{
        code: string;
        area: number;
        isIntermittent: boolean;
        isWaterCooled: boolean;
    }>;

    exemptZones: Array<{
        code: string;
        area: number;
    }>;

    // Equipment handled simply for now, but structure ready
    equipment: {
        elevators: number; // Et
        pumps: number; // Ep
        heating: number; // Eh
    };
}

export interface CalculationResult {
    teui: number;
    euiAdj: number;
    score: number;
    grade: string;
    benchmarks: {
        min: number;
        g: number;
        max: number;
    };
}
