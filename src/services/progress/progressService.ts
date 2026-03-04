import { LessonId, CourseId } from "../../domain/types";

export type LessonProgress = {
  completed: boolean;
  percent: number; // 0..100 (fake for now)
  updatedAt: number;
};

type CourseProgressStore = Record<LessonId, LessonProgress>;

const KEY_PREFIX = "discipular.progress.v1";

function key(courseId: CourseId) {
  return `${KEY_PREFIX}:${courseId}`;
}

function load(courseId: CourseId): CourseProgressStore {
  try {
    const raw = localStorage.getItem(key(courseId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CourseProgressStore;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function save(courseId: CourseId, store: CourseProgressStore) {
  localStorage.setItem(key(courseId), JSON.stringify(store));
}

export function getLessonProgress(courseId: CourseId, lessonId: LessonId): LessonProgress | undefined {
  const store = load(courseId);
  return store[lessonId];
}

export function setLessonCompleted(courseId: CourseId, lessonId: LessonId, completed: boolean) {
  const store = load(courseId);
  const current = store[lessonId];
  store[lessonId] = {
    completed,
    percent: completed ? 100 : (current?.percent ?? 0),
    updatedAt: Date.now(),
  };
  save(courseId, store);
}

export function bumpLessonPercent(courseId: CourseId, lessonId: LessonId, percent: number) {
  const store = load(courseId);
  const current = store[lessonId];
  const next = Math.max(current?.percent ?? 0, Math.min(100, Math.round(percent)));
  store[lessonId] = {
    completed: next >= 100 ? true : (current?.completed ?? false),
    percent: next,
    updatedAt: Date.now(),
  };
  save(courseId, store);
}

export function resetCourseProgress(courseId: CourseId) {
  localStorage.removeItem(key(courseId));
}

export function getCourseProgress(courseId: CourseId, lessonIds: LessonId[]) {
  const store = load(courseId);
  const total = lessonIds.length;
  const completedCount = lessonIds.filter((id) => store[id]?.completed).length;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  return { total, completedCount, percent };
}


// ✅ ADICIONE ISTO:
export function getModuleProgress(courseId: CourseId, moduleId: string, lessonIds: LessonId[]) {
  // moduleId fica disponível pra uso futuro (ex: cache por módulo),
  // mas por enquanto só calculamos baseado nas aulas do módulo.
  void moduleId;
  return getCourseProgress(courseId, lessonIds);
}