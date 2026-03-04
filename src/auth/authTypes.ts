export type AccountType = "individual" | "institution";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  accountType: AccountType;

  // Individual fields
  birthDate?: string; // YYYY-MM-DD
  city?: string;
  state?: string;

  // Institution fields (Approach A)
  institutionName?: string;
  institutionCity?: string;
  institutionState?: string;
  responsibleName?: string;

  createdAt: number;
  updatedAt: number;
};

export type Entitlement = {
  id: string;
  plan: "premium";
  source: "code";
  code: string;
  scope: "full";
  institutionName?: string;
  active: boolean;
  startsAt: number;
  expiresAt?: number | null;
};

export type InstitutionCode = {
  code: string;
  status: "active" | "redeemed" | "revoked" | "expired";
  redeemedByUid?: string;
  redeemedAt?: number;
  createdAt: number;
  batchId: string;
};
