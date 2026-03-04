import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebase/firebase";
import type { AccountType, UserProfile } from "./authTypes";
import { createUserProfile, getUserProfile } from "../services/firebase/profileService";
import { clearProfile, getProfile, setProfile } from "./authStorage";

/**
 * AuthProvider (Firebase-first)
 * - Uses Firebase Auth for session
 * - Stores/reads profile in Firestore (/users/{uid})
 * - Also mirrors the profile to localStorage for fast boot + offline-friendly UI
 */
type AuthState = {
  booting: boolean;
  profile: UserProfile | null;
  isAuthed: boolean;
  accountType: AccountType | null;
  authError: string | null;
  authWarning: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  registerIndividual: (data: {
    displayName: string;
    email: string;
    password: string;
    birthDate: string;
    city: string;
    state: string;
  }) => Promise<void>;

  registerInstitution: (data: {
    institutionName: string;
    institutionCity: string;
    institutionState: string;
    responsibleName: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

function now() {
  return Date.now();
}

async function loadProfile(uid: string, email?: string | null): Promise<UserProfile | null> {
  const remote = await getUserProfile(uid);
  if (remote) return remote;

  // Fallback: if no profile yet, try local mirror (useful during migration)
  const local = getProfile();
  if (local && local.uid === uid) return local;

  // If nothing exists, create minimal profile (rare)
  const p: UserProfile = {
    uid,
    email: email ?? "",
    displayName: "Usuário",
    accountType: "individual",
    createdAt: now(),
    updatedAt: now(),
  };
  await createUserProfile(p);
  return p;
}

export function AuthProvider({ children }: { children: any }) {
  const [booting, setBooting] = useState(true);
  const [profile, setProfileState] = useState<UserProfile | null>(getProfile());
  const [authError, setAuthError] = useState<string | null>(null);
  const [authWarning, setAuthWarning] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthError(null);
      setAuthWarning(null);

      try {
        if (!u) {
          setProfileState(null);
          clearProfile();
          setBooting(false);
          return;
        }

        try {
          const p = await loadProfile(u.uid, u.email);
          setProfile(p);
          setProfileState(p);
        } catch (e: any) {
          // Most common case: Firestore rules not allowing /users/{uid} read/write yet.
          console.error("[auth] profile load failed:", e);
          const fallback: UserProfile = {
            uid: u.uid,
            email: u.email ?? "",
            displayName: u.displayName ?? "Usuário",
            accountType: "individual",
            createdAt: now(),
            updatedAt: now(),
          };
          setProfile(fallback);
          setProfileState(fallback);
          setAuthWarning("Login ok, mas o perfil não pôde ser carregado no Firestore (verifique as regras).");
        }
      } catch (e: any) {
        console.error("[auth] auth state error:", e);
        setAuthError(e?.message ?? "Erro ao inicializar autenticação.");
        setProfileState(null);
        clearProfile();
      } finally {
        setBooting(false);
      }
    });
    return () => unsub();
  }, []);

  async function login(email: string, password: string) {
    setAuthError(null);
    setAuthWarning(null);
    await signInWithEmailAndPassword(auth, email, password);
    // profile will load via onAuthStateChanged
  }

  async function logout() {
    await signOut(auth);
    // state will clear via listener
  }

  async function registerIndividual(data: {
    displayName: string;
    email: string;
    password: string;
    birthDate: string;
    city: string;
    state: string;
  }) {
    setAuthError(null);
    setAuthWarning(null);
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const t = now();
    const p: UserProfile = {
      uid: cred.user.uid,
      email: data.email,
      displayName: data.displayName,
      accountType: "individual",
      birthDate: data.birthDate,
      city: data.city,
      state: data.state,
      createdAt: t,
      updatedAt: t,
    };
    await createUserProfile(p);
    setProfile(p);
    setProfileState(p);
  }

  async function registerInstitution(data: {
    institutionName: string;
    institutionCity: string;
    institutionState: string;
    responsibleName: string;
    email: string;
    password: string;
  }) {
    setAuthError(null);
    setAuthWarning(null);
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const t = now();
    const p: UserProfile = {
      uid: cred.user.uid,
      email: data.email,
      displayName: data.responsibleName,
      accountType: "institution",
      institutionName: data.institutionName,
      institutionCity: data.institutionCity,
      institutionState: data.institutionState,
      responsibleName: data.responsibleName,
      createdAt: t,
      updatedAt: t,
    };
    await createUserProfile(p);
    setProfile(p);
    setProfileState(p);
  }

  const value = useMemo<AuthState>(
    () => ({
      booting,
      profile,
      isAuthed: !!profile,
      accountType: profile?.accountType ?? null,
      authError,
      authWarning,
      login,
      logout,
      registerIndividual,
      registerInstitution,
    }),
    [booting, profile, authError, authWarning]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
