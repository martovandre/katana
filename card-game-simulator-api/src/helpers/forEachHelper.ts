export async function asyncForEach(
  a: any[],
  fn: (item: any, i: number, a: any[]) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < a.length; i++) {
    await fn(a[i], i, a);
  }
}

export async function parallelForEach(
  a: any[],
  fn: (item: any) => Promise<void>,
): Promise<void> {
  await Promise.all(a.map(item => fn(item)));
}
