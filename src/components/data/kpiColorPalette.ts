
export const PALETTE = [
  "#f59e42", // orange
  "#f43f5e", // pink
  "#10b981", // teal
  "#eab308", // yellow
  "#6366f1", // indigo
  "#4b5563", // zinc
  "#164e63", // cyan9
  "#FB7185", // blush
  "#7c3aed", // purple
  "#059669", // emerald
];

// Used to assign a unique color not already in use
export function getDefaultColor(existingColors: string[] = []) {
  for (const color of PALETTE) {
    if (!existingColors.includes(color)) return color;
  }
  // fallback: generate pseudo-random
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}
