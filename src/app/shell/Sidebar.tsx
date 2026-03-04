import { Logo } from "../../ui/Logo";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { listCourses } from "../../curriculum";
import { canAccessModule } from "../../auth/entitlements";
import { useAuth } from "../../auth/AuthContext";

type SidebarProps = { open: boolean; onClose: () => void };

function moduleHref(courseId: string, moduleId: string) {
  return `/course/${courseId}/module/${moduleId}`;
}
function lessonHref(courseId: string, lessonId: string) {
  return `/course/${courseId}/lesson/${lessonId}`;
}

// ─── ModuleGroup ─────────────────────────────────────────────────────────────
// Sem animação JS — abre/fecha via estado React, conteúdo sempre no DOM.
// O scroll fica no container pai (sidebarCurricular), não no grupo.

function ModuleGroup({
  courseId,
  module: m,
  isOpen,
  onToggle,
  location,
  onClose,
}: {
  courseId: string;
  module: {
    id: string;
    title: string;
    icon: string;
    lessons: { id: string; title: string; contentRef?: { type: string } }[];
    isAvailable: boolean;
    canAccess: boolean;
  };
  isOpen: boolean;
  onToggle: () => void;
  location: string;
  onClose: () => void;
}) {
  const statusLabel = m.isAvailable
    ? m.canAccess ? "Disponível" : "Premium"
    : "Em breve";
  const statusCls = m.isAvailable
    ? m.canAccess ? "sideBadge ok" : "sideBadge premium"
    : "sideBadge soon";

  return (
    <div className={`sideGroup${isOpen ? " sideGroupOpen" : ""}`}>
      <button
        className="sideGroupHeader"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="sideGroupIcon">{m.icon}</span>
        <span className="sideGroupTitle">{m.title}</span>
        <span className={statusCls}>{statusLabel}</span>
        <span
          className="sideGroupCaret"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          ▸
        </span>
      </button>

      {/* Corpo: visível apenas quando isOpen — sem animação JS, sem max-height */}
      {isOpen && (
        <div className="sideGroupBody">
          {/* Ver todas */}
          <Link
            className={[
              "sideSubLink",
              location === moduleHref(courseId, m.id) ? "active" : "",
              !m.isAvailable || !m.canAccess ? "disabled" : "",
            ].filter(Boolean).join(" ")}
            href={m.isAvailable ? (m.canAccess ? moduleHref(courseId, m.id) : "/redeem") : "#"}
            onClick={onClose}
          >
            <span className="sideSubNum" style={{ fontSize: 11 }}>≡</span>
            Ver todas as aulas
          </Link>

          {/* Todas as aulas individualmente */}
          {m.lessons.map((l, idx) => {
            const hasContent = m.isAvailable && m.canAccess && l.contentRef?.type === "package";
            const href = hasContent
              ? lessonHref(courseId, l.id)
              : m.isAvailable && !m.canAccess ? "/redeem" : "#";

            return (
              <Link
                key={l.id}
                className={[
                  "sideSubLink",
                  location === lessonHref(courseId, l.id) ? "active" : "",
                  !hasContent ? "disabled" : "",
                ].filter(Boolean).join(" ")}
                href={href}
                onClick={onClose}
              >
                <span className="sideSubNum">{idx + 1}</span>
                {l.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { profile, logout } = useAuth();
  const courses = listCourses();
  const course = courses[0];

  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setOpenModuleId(null);
  }, [open]);

  const items = useMemo(() => {
    if (!course) return [];
    return course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      icon: m.icon ?? "📚",
      lessons: m.lessons,
      isAvailable: m.lessons.some((l) => l.contentRef?.type === "package"),
      canAccess: canAccessModule(m.id),
    }));
  }, [course]);

  return (
    <>
      <div
        className={`overlay${open ? " overlayOpen" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${open ? " sidebarOpen" : ""}`} aria-label="Menu de navegação">

        {/* Topo */}
        <div className="sidebarTop">
          <div className="sidebarBrand">
            <Logo variant="nav" />
          </div>
          <button className="iconBtn" onClick={onClose} aria-label="Fechar menu" type="button">
            ✕
          </button>
        </div>

        {/* Perfil */}
        {profile && (
          <div className="sidebarProfile">
            <div className="sidebarAvatar">
              {profile.displayName?.[0]?.toUpperCase() ?? "D"}
            </div>
            <div className="sidebarProfileInfo">
              <div className="sidebarProfileName">{profile.displayName}</div>
              <div className="sidebarProfileEmail">{profile.email}</div>
            </div>
          </div>
        )}

        {/* ── Navegação rápida (fixo, sem scroll) ── */}
        <div className="sidebarQuickNav">
          <div className="sidebarSectionTitle">Navegação</div>
          <Link
            className={`sideLink${location === "/" || location.startsWith("/courses") ? " active" : ""}`}
            href="/courses"
            onClick={onClose}
          >
            🏠 Minha Jornada
          </Link>
          <Link
            className={`sideLink${location.startsWith("/library") ? " active" : ""}`}
            href="/library"
            onClick={onClose}
          >
            📚 Biblioteca
          </Link>
        </div>

        {/* ── Grade curricular — box com scroll próprio ── */}
        <div className="sidebarCurricularWrap">
          <div className="sidebarSectionTitle">Grade Curricular</div>
          <div className="sidebarCurricular">
            {items.map((m) => (
              <ModuleGroup
                key={m.id}
                courseId={course.id}
                module={m}
                isOpen={openModuleId === m.id}
                onToggle={() => setOpenModuleId(prev => prev === m.id ? null : m.id)}
                location={location}
                onClose={onClose}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebarFooter">
          <button
            className="sideLogoutBtn"
            type="button"
            onClick={async () => { await logout(); }}
          >
            ← Sair da conta
          </button>
          <span className="sidebarVersion">v1.3.3</span>
        </div>
      </aside>
    </>
  );
}
