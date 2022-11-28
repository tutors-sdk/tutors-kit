import { writable, type Writable } from "svelte/store";
import type { Lo, WeekType } from "tutors-reader-lib/src/types/lo-types";
import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
import { localStorageStore } from "@brainandbones/skeleton";
import type { Course } from "src/models/course";

const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null
};
const students: StudentMetric[] = [];

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse: Writable<Course> = writable(null);
export const currentLo: Writable<Lo> = writable(null);
export const currentUser: Writable<any> = writable(null);
export const portfolio = writable(false);
export const layout = writable("");
export const studentsOnline = writable(0);
export const studentsOnlineList = writable(students);
export const infoDrawer: Writable<boolean> = writable(false);
export const calendarDrawer: Writable<boolean> = writable(false);
export const onlineDrawer: Writable<boolean> = writable(false);
export const tocDrawer: Writable<boolean> = writable(false);
export const storeTheme: Writable<string> = localStorageStore("storeTheme", "tutors");
export const authenticating: Writable<boolean> = writable(false);
