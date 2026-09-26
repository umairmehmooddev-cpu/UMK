/**
 * Product feature UI registers here in later slices.
 * The shell registers none. This module is safe to import from client code
 * because it holds no secrets and no provider SDK.
 */
export type FeatureModule = {
  readonly id: string;
  readonly title: string;
};

export const featureModules: readonly FeatureModule[] = [];
