export interface RoomParams {
  length: number;
  width: number;
  height: number;
}

export type LayoutType = 'herringbone' | 'straight';

export interface PlankParams {
  length: number; // mm
  width: number;  // mm
  gap: number;    // mm
}

export interface Calculations {
  floorArea: number;
  paintArea: number;
  paintLiters: number;
  skirtingMeters: number;
  totalPlanks: number;
  planksWithWaste: number;
}
