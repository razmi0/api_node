export const buildId = (parkings) => Math.max(...parkings.map((p) => p.id), 0) + 1;
