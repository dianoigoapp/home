import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "./AuthContext";

const ONBOARDING_KEY = "dianoigo_onboarding_done";

export function AuthGuard({ children }: { children: any }) {
  const { booting, isAuthed } = useAuth();
  const [, nav] = useLocation();

  useEffect(() => {
    if (booting) return;
    if (!isAuthed) {
      const done = localStorage.getItem(ONBOARDING_KEY);
      nav(done ? "/auth/login" : "/onboarding");
    }
  }, [booting, isAuthed, nav]);

  if (booting) return null;
  if (!isAuthed) return null;
  return children;
}

export function InstitutionGuard({ children }: { children: any }) {
  const { booting, isAuthed, accountType } = useAuth();
  const [, nav] = useLocation();

  useEffect(() => {
    if (booting) return;
    if (!isAuthed) nav("/auth/login");
    else if (accountType !== "institution") nav("/");
  }, [booting, isAuthed, accountType, nav]);

  if (booting) return null;
  if (!isAuthed || accountType !== "institution") return null;
  return children;
}
