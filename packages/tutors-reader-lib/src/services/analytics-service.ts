import { updateLo } from "../utils/course-utils";
import type { Lo } from "../types/lo-types";
import type { Course } from "../models/course";
import type { User } from "../types/auth-types";
import { currentCourse, currentUser } from "../stores/stores";

import { sanitise, updateCalendar, updateCount, updateCountValue, updateLastAccess, updateStr, updateVisits } from "tutors-reader-lib/src/utils/firebase-utils";

let course: Course;
let user: User;

currentCourse.subscribe((current) => {
  course = current;
});
currentUser.subscribe((current) => {
  user = current;
});

let mins = 0;
const func = () => {
  mins = mins + 0.5;
  if (course && !document.hidden) {
    analyticsService.updatePageCount();
  }
};
setInterval(func, 30 * 1000);

export const analyticsService = {
  courseId: "",
  courseUrl: "",
  loRoute: "",
  lo: <Lo>{},

  learningEvent(params: Record<string, string>, data: Record<string, string>) {
    this.courseUrl = params.courseid;
    this.courseId = params.courseid.substring(0, params.courseid.indexOf("."));
    this.loRoute = "";
    if (params.loid) this.loRoute = sanitise(params.loid);
    this.lo = data.lo;
    this.reportPageLoad();
  },

  setOnlineStatus(status: boolean) {
    const key = `${this.courseId}/users/${sanitise(user.email)}`;
    if (status) {
      updateStr(key, "online");
    } else {
      updateStr(key, "offline");
    }
  },

  reportPageLoad() {
    updateLastAccess(`${this.courseId}/usage/${this.loRoute}`, this.lo.title);
    updateVisits(this.courseId);

    updateLastAccess(`all-course-access/${this.courseId}`, this.lo.title);
    updateVisits(`all-course-access/${this.courseId}`);
    updateLo(`all-course-access/${this.courseId}`, course, this.lo);

    if (user) {
      const key = `${this.courseId}/users/${sanitise(user.email)}`;
      updateLastAccess(key, this.lo.title);
      updateVisits(key);
    }
  },

  updatePageCount() {
    updateLastAccess(`${this.courseId}/usage/${this.loRoute}`, this.lo.title);
    updateCount(this.courseId);
    if (user) {
      const key = `${this.courseId}/users/${sanitise(user.email)}`;
      updateLastAccess(key, this.lo.title);
      updateCount(key);
      updateCalendar(key);
    }
  },

  updateLogin(user: User) {
    const key = `${this.courseId}/users/${sanitise(user.email)}`;
    updateStr(`${key}/email`, user.email);
    updateStr(`${key}/name`, user.name);
    updateStr(`${key}/id`, user.userId);
    updateStr(`${key}/nickname`, user.nickname);
    updateStr(`${key}/picture`, user.picture);
    updateStr(`${key}/last`, new Date().toString());
    updateCountValue(`${key}/count`);
  }
};
