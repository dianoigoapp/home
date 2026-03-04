export type PackManifestLesson = {
  lessonId: string;
  title: string;
  file: string;
  assessmentFile?: string;
  estimatedStudyMinutes?: number;
  estimatedMeetingMinutes?: number;
};

export type PackManifest = {
  packId: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  version: string;
  updatedAt: string;
  passingScore: number;
  assets: string[];
  lessons: PackManifestLesson[];
};
