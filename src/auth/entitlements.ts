import { hasActivePremium } from "./authStorage";

/**
 * MVP access policy:
 * - Only module FND-M01 is free.
 * - Everything else requires premium entitlement.
 */
export const FREE_MODULE_IDS = ["FND-M01"];

export function isModuleFree(moduleId: string) {
  return FREE_MODULE_IDS.includes(moduleId);
}

export function canAccessModule(moduleId: string) {
  return isModuleFree(moduleId) || hasActivePremium();
}
