export function calcProgress(wishes: { fulfilled: boolean }[]) {
  if (wishes.length === 0) return 0;
  const done = wishes.filter(w => w.fulfilled).length;
  return Math.round((done / wishes.length) * 100);
}
