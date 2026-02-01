export const normalizeInt = (
  value: string | string[] | undefined,
  fallback: number
) => {
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
};
