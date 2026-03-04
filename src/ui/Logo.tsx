/**
 * <Logo> — componente central da marca Dianoigo.
 *
 * FONTE DA VERDADE: para mudar nome, ícone ou tipografia da marca,
 * edite APENAS as constantes abaixo. Todos os lugares do app atualizam.
 *
 * Variantes:
 *   "nav"    — header e sidebar (compacto)
 *   "auth"   — painel lateral das telas de auth (médio, cor fixa clara)
 *   "mobile" — topo mobile das telas de auth (médio, cor do tema)
 *   "splash" — tela de carregamento e onboarding (grande)
 */

export const BRAND_NAME = "Dianoigo";
export const BRAND_ICON = "✦"; // Substituir pelo SVG quando disponível
export const BRAND_TAGLINE = "Despertar para as Escrituras";

type LogoVariant = "nav" | "auth" | "mobile" | "splash";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  /** Mostra apenas o ícone, sem o texto */
  iconOnly?: boolean;
  /** Mostra apenas o texto, sem o ícone */
  textOnly?: boolean;
}

export function Logo({
  variant = "nav",
  className = "",
  iconOnly = false,
  textOnly = false,
}: LogoProps) {
  const variantClass = `logo--${variant}`;

  return (
    <div
      className={`logoRoot ${variantClass} ${className}`}
      aria-label={BRAND_NAME}
      role="img"
    >
      {!textOnly && (
        <div className="logoIcon" aria-hidden="true">
          {BRAND_ICON}
        </div>
      )}
      {!iconOnly && (
        <span className="logoBrand">{BRAND_NAME}</span>
      )}
    </div>
  );
}
