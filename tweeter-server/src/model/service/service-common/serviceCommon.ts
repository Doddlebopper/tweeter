export const pause = (durationInMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, durationInMs));

