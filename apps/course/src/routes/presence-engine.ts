import { courseUrl, currentCourse, currentUser, studentsOnline, studentsOnlineList, calendarDrawer, infoDrawer, tocDrawer } from "tutors-reader-lib/src/stores/stores";
import type { Course } from "tutors-reader-lib/src/models/course";
import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
import { MetricsService } from "tutors-reader-lib/src/services/metrics-service";
import { PresenceService } from "tutors-reader-lib/src/services/presence-service";
import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";

const students: StudentMetric[] = [];
let metricsService: MetricsService;
let presenceService: PresenceService;
let lastCourse: Course;
let user: User;

function refresh(refreshedStudents: StudentMetric[]) {
  const student = refreshedStudents.find((student) => student.nickname === user.nickname);
  const index = refreshedStudents.indexOf(student);
  if (index !== -1) {
    refreshedStudents.splice(index, 1);
  }
  studentsOnlineList.set([...refreshedStudents]);
  studentsOnline.set(refreshedStudents.length);
}

async function initService(course: Course) {
  if (presenceService) presenceService.stop();
  presenceService = new PresenceService(metricsService, students, refresh, null);
  presenceService.setCourse(course);
  await presenceService.start();
  studentsOnlineList.set([]);
  studentsOnline.set(0);
}

export function startPresenceEngine() {
  metricsService = new MetricsService();
  currentCourse.subscribe((newCourse: Course) => {
    if (newCourse && newCourse != lastCourse) {
      lastCourse = newCourse;
      if (isAuthenticated() && newCourse?.authLevel > 0) {
        metricsService.setCourse(newCourse);
        initService(newCourse);
      }
    }
  });
  currentUser.subscribe((newUser: User) => {
    user = newUser;
  });
}
