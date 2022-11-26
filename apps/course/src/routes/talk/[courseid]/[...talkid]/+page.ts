import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";
import type { Course } from "tutors-reader-lib/src/models/course";
import { currentCourse, currentLo } from "tutors-reader-lib/src/stores/stores";

export const ssr = false;

export const load: PageLoad = async ({ url, params }) => {
  const course: Course = await courseService.getOrLoadCourse(params.courseid);
  currentCourse.set(course);
  const lo = course.loIndex.get(url.pathname);
  if (lo) currentLo.set(lo);
  return {
    course: course,
    lo: lo
  };
};
