export const sleep = (timeout = 1_000) => new Promise<void>((res) => setTimeout(() => res(), timeout));

export default sleep;
