import type { UserProfile, Entitlement, InstitutionCode } from "./authTypes";

const LS_PROFILE = "discipular.profile";
const LS_ENTITLEMENTS = "discipular.entitlements";
const LS_INST_CODES = "discipular.institution.codes";

function now() {
  return Date.now();
}

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(LS_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setProfile(profile: UserProfile) {
  localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(LS_PROFILE);
  localStorage.removeItem(LS_ENTITLEMENTS);
}

export function getEntitlements(): Entitlement[] {
  const raw = localStorage.getItem(LS_ENTITLEMENTS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Entitlement[];
  } catch {
    return [];
  }
}

export function setEntitlements(items: Entitlement[]) {
  localStorage.setItem(LS_ENTITLEMENTS, JSON.stringify(items));
}

export function addEntitlement(ent: Entitlement) {
  const items = getEntitlements();
  items.unshift(ent);
  setEntitlements(items);
}

export function hasActivePremium(): boolean {
  const ents = getEntitlements();
  const t = now();
  return ents.some((e) => e.active && (e.expiresAt == null || e.expiresAt > t));
}

/**
 * Institution codes are stored locally for MVP.
 * In production: read via Firestore + realtime listeners.
 */
export function getInstitutionCodes(): InstitutionCode[] {
  const raw = localStorage.getItem(LS_INST_CODES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as InstitutionCode[];
  } catch {
    return [];
  }
}

export function setInstitutionCodes(codes: InstitutionCode[]) {
  localStorage.setItem(LS_INST_CODES, JSON.stringify(codes));
}

export function ensureInstitutionCodesSeed(totalSeats: number, batchId: string) {
  const existing = getInstitutionCodes();
  if (existing.length) return;

  // deterministic-ish generator
  function chunk(n = 4) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  const out: InstitutionCode[] = [];
  for (let i = 0; i < totalSeats; i++) {
    out.push({
      code: `DISC-INS-${chunk()}-${chunk()}`,
      status: "active",
      createdAt: now(),
      batchId,
    });
  }
  setInstitutionCodes(out);
}

export function redeemInstitutionCode(code: string, uid: string): InstitutionCode | null {
  const codes = getInstitutionCodes();
  const idx = codes.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
  if (idx === -1) return null;

  const c = codes[idx];
  if (c.status !== "active") return null;

  codes[idx] = { ...c, status: "redeemed", redeemedByUid: uid, redeemedAt: now() };
  setInstitutionCodes(codes);
  return codes[idx];
}
