import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";
import type { Course } from "tutors-reader-lib/src/models/course";
import { getKeys } from "../../../environment";
import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
import { currentCourse, currentLo } from "tutors-reader-lib/src/stores/stores";

export const load: PageLoad = async ({ params }) => {
  initFirebase(getKeys().firebase);
  const course: Course = await courseService.readCourse(params.courseid);
  currentCourse.set(course);
  currentLo.set(course.lo);
  return {
    course: course
  };
};
