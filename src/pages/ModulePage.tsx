import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { getCourseById } from "../curriculum";
import { canAccessModule } from "../auth/entitlements";
import { Card, LessonCard } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { getLessonProgress, getModuleProgress } from "../services/progress/progressService";

export function ModulePage() {
  const { courseId, moduleId } = useParams() as { courseId: string; moduleId: string };
  const course = getCourseById(courseId);
  const mod = course?.modules.find((m) => m.id === moduleId);
  const isAvailable = !!mod?.lessons.some((l) => l.contentRef?.type === "package");
  const canAccess = mod ? canAccessModule(mod.id) : false;

  const lessonIds = useMemo(() => mod?.lessons.map((l) => l.id) ?? [], [mod]);
  const mp = useMemo(() => {
    if (!course || !mod) return { percent: 0, total: 0, completedCount: 0 };
    return getModuleProgress(course.id, mod.id, lessonIds);
  }, [course, mod, lessonIds]);

  if (!course || !mod) {
    return (
      <div className="page">
        <h1>Módulo não encontrado</h1>
        <Link href="/courses" className="linkBtn">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div className="kicker">{course.title}</div>
        <h1>
          <span style={{ marginRight: 8 }}>{mod.icon ?? "📚"}</span>
          {mod.title}
        </h1>

        {/* Stats do módulo */}
        <div className="statsGrid" style={{ marginTop: 14, gridTemplateColumns: "repeat(3,1fr)" }}>
          <div className="statCard">
            <div className="statNum">{mp.total}</div>
            <div className="statLabel">Aulas</div>
          </div>
          <div className="statCard">
            <div className="statNum">{mp.completedCount}</div>
            <div className="statLabel">Concluídas</div>
          </div>
          <div className="statCard">
            <div className="statNum">{mp.percent}%</div>
            <div className="statLabel">Progresso</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <ProgressBar value={mp.percent} />
        </div>
      </header>

      {!isAvailable && (
        <Card>
          <div className="cardTitle">Conteúdo em produção</div>
          <p className="muted">Este módulo está na grade, mas ainda não foi liberado no app. Volte em breve.</p>
        </Card>
      )}

      {isAvailable && !canAccess && (
        <Card>
          <div className="cardTitle">Conteúdo premium</div>
          <p className="muted">Este módulo está disponível, mas requer Premium para acessar.</p>
          <div className="cardActions">
            <Link className="primaryBtn" href="/redeem">Desbloquear Premium</Link>
          </div>
        </Card>
      )}

      <div className="stack">
        {mod.lessons.map((l, idx) => {
          const lp = getLessonProgress(course.id, l.id);
          const completed = !!lp?.completed;
          const percent = lp?.percent ?? 0;

          const sub = completed
            ? "Concluída"
            : percent > 0
            ? `Em andamento · ${percent}%`
            : l.estimatedMinutes
            ? `Não iniciada · ~${l.estimatedMinutes} min`
            : "Não iniciada";

          return (
            <LessonCard
              key={l.id}
              icon={mod.icon}
              title={`${idx + 1}. ${l.title}`}
              sub={sub}
              percent={percent}
              completed={completed}
              href={isAvailable && canAccess && l.contentRef?.type === "package" ? `/course/${course.id}/lesson/${l.id}` : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
