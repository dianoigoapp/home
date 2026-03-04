import { Logo } from "../ui/Logo";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../auth/AuthContext";
import { Card } from "../ui/Card";

export function SplashPage() {
  const { booting, isAuthed, accountType } = useAuth();
  const [, nav] = useLocation();

  useEffect(() => {
    if (booting) return;
    if (!isAuthed) nav("/auth/login");
    else nav(accountType === "institution" ? "/pastoral/dashboard" : "/");
  }, [booting, isAuthed, accountType, nav]);

  return (
    <div className="page centerPage">
      <Logo variant="splash" />
      <Card>
        <div className="muted">{booting ? "Carregando…" : "Redirecionando…"}</div>
      </Card>
    </div>
  );
}
