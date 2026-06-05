/**
 * Concatenate class names while skipping falsy values.
 * Intentionally lightweight — no clsx / tailwind-merge dependency.
 */
export function cx(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(" ")
}

/**
 * Merge a recipe className with a user-provided className that may be either
 * a string or a state-callback (Base UI pattern). Returns the same shape so
 * Base UI components can still resolve callbacks per state.
 */
export function mergeClass<TState>(
  base: string,
  userClassName: string | ((state: TState) => string | undefined) | undefined,
): string | ((state: TState) => string | undefined) {
  if (typeof userClassName === "function") {
    return (state: TState) => cx(base, userClassName(state))
  }
  return cx(base, userClassName)
}
