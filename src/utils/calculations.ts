import type { RoomParams, PlankParams, Calculations } from '../types';

export function calculateRoom(
  room: RoomParams,
  plank: PlankParams,
  layoutType: 'herringbone' | 'straight'
): Calculations {
  const floorArea = room.length * room.width;
  const wallArea =
    2 * room.length * room.height + 2 * room.width * room.height;
  const paintArea = wallArea;
  // ~1 litre per 10 m² (one coat)
  const paintLiters = Math.ceil((paintArea / 10) * 2) / 2; // round to 0.5
  const skirtingMeters = 2 * (room.length + room.width);

  const plankLm = plank.length / 1000;
  const plankWm = plank.width / 1000;
  const plankArea = plankLm * plankWm;

  let totalPlanks: number;
  if (layoutType === 'herringbone') {
    // Herringbone wastes ~15% more than straight
    totalPlanks = Math.ceil((floorArea / plankArea) * 1.15);
  } else {
    totalPlanks = Math.ceil(floorArea / plankArea);
  }

  const planksWithWaste = Math.ceil(totalPlanks * 1.1);

  return {
    floorArea: +floorArea.toFixed(2),
    paintArea: +paintArea.toFixed(2),
    paintLiters: +paintLiters.toFixed(1),
    skirtingMeters: +skirtingMeters.toFixed(2),
    totalPlanks,
    planksWithWaste,
  };
}
