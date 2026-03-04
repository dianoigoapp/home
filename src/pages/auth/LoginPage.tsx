import { Logo } from "../../ui/Logo";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../auth/AuthContext";

export function LoginPage() {
  const { login, authError, authWarning } = useAuth();
  const [, nav] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) { setErr("Preencha email e senha."); return; }
    try {
      setBusy(true);
      setErr(null);
      await login(email.trim(), password);
      nav("/splash");
    } catch (e: any) {
      setErr(e?.message ?? "Falha no login. Verifique suas credenciais.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authRoot">
      {/* Painel esquerdo — decorativo */}
      <div className="authPanel" aria-hidden="true">
        <div className="authPanelInner">
          <div className="authPanelLogo">
            <Logo variant="auth" />
          </div>
          <blockquote className="authQuote">
            "A Palavra de Deus é viva e eficaz, e mais cortante do que qualquer espada de dois gumes."
            <cite>Hebreus 4:12</cite>
          </blockquote>
          <div className="authPanelDots">
            <span /><span /><span />
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="authForm">
        <div className="authFormInner">
          {/* Logo mobile */}
          <div className="authMobileLogo">
            <Logo variant="auth" />
          </div>

          <div className="authHeading">
            <h1>Bem-vindo de volta</h1>
            <p>Entre com seu email e senha para continuar sua jornada.</p>
          </div>

          {(authError || authWarning) && (
            <div className={`authAlert ${authWarning && !authError ? "warn" : "danger"}`}>
              {authError || authWarning}
            </div>
          )}

          <div className="authFields">
            <label className="authField">
              <span className="authFieldLabel">Email</span>
              <input
                className="authInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </label>

            <label className="authField">
              <span className="authFieldLabel">Senha</span>
              <div className="authInputWrap">
                <input
                  className="authInput"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  className="authInputToggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            {err && <div className="authAlert danger">{err}</div>}

            <button
              className="authSubmitBtn"
              type="button"
              disabled={busy}
              onClick={handleLogin}
            >
              {busy ? (
                <span className="authSpinner" />
              ) : (
                "Entrar"
              )}
            </button>
          </div>

          <div className="authFooterLinks">
            <span>Não tem conta?</span>
            <Link href="/auth/register/type" className="authLink">
              Criar conta gratuita →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
