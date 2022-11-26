import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";
import type { Course } from "tutors-reader-lib/src/models/course";
import { currentCourse, currentLo } from "tutors-reader-lib/src/stores/stores";

export const load: PageLoad = async ({ params }) => {
  const course: Course = await courseService.getOrLoadCourse(params.courseid);
  currentCourse.set(course);
  currentLo.set(course.lo);
  return {
    course: course
  };
};
