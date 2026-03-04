import { Link } from "wouter";
import type { LessonRef } from "../../domain/types";
import { getCourseById } from "../../curriculum";

export function BottomNav({
  courseId,
  prev,
  next,
  currentIndex,
  total,
}: {
  courseId: string;
  prev?: LessonRef;
  next?: LessonRef;
  currentIndex?: number;
  total?: number;
}) {
  const course = getCourseById(courseId);

  // Resolve títulos das aulas vizinhas para melhor UX
  const prevLesson = prev && course
    ? course.modules.flatMap((m) => m.lessons).find((l) => l.id === prev.id)
    : undefined;
  const nextLesson = next && course
    ? course.modules.flatMap((m) => m.lessons).find((l) => l.id === next.id)
    : undefined;

  const prevLabel = prevLesson?.title
    ? truncate(prevLesson.title, 22)
    : "Anterior";
  const nextLabel = nextLesson?.title
    ? truncate(nextLesson.title, 22)
    : "Próximo";

  return (
    <footer className="bottomNav">
      <div className="bottomNavInner">
        {prev ? (
          <Link
            href={`/course/${courseId}/lesson/${prev.id}`}
            className="navBtn"
            title={prevLesson?.title}
          >
            ← {prevLabel}
          </Link>
        ) : (
          <span className="navBtn navBtnDisabled">← Anterior</span>
        )}

        <div className="navCenter">
          {typeof currentIndex === "number" && typeof total === "number" ? (
            <span className="navPill">
              Aula {currentIndex + 1} de {total}
            </span>
          ) : (
            <span className="navPill">{course?.title ?? "Fundamentos"}</span>
          )}
        </div>

        {next ? (
          <Link
            href={`/course/${courseId}/lesson/${next.id}`}
            className="navBtn navNext"
            title={nextLesson?.title}
          >
            {nextLabel} →
          </Link>
        ) : (
          <span className="navBtn navNext navBtnDisabled">Próximo →</span>
        )}
      </div>
    </footer>
  );
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}
