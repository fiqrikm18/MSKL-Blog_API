export function bindAll<T extends object>(instance: T): T {
  const proto = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(proto).filter(
    name => name !== "constructor" && typeof proto[name] === "function"
  );

  for (const name of methodNames) {
    const fn = proto[name];
    if (typeof fn === "function") {
      Object.defineProperty(instance, name, {
        value: fn.bind(instance),
        writable: true,
        configurable: true,
      });
    }
  }

  return instance;
}
