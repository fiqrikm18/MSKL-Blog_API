import { asyncHandler } from "./async_handler";

export function bindAndHandleAll<T extends object>(instance: T): T {
  const prototype = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (key) =>
      typeof instance[key as keyof T] === "function" && key !== "constructor"
  );

  for (const key of methodNames) {
    const originalMethod = instance[key as keyof T] as unknown as Function;
    (instance as any)[key] = asyncHandler(originalMethod.bind(instance));
  }

  return instance;
}
