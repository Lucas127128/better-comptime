export function fibonacci(n: number) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
