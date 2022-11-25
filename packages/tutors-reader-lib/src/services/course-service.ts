import path from "path-browserify";
import { courseUrl, currentCourse, currentLo, currentUser, week } from "../stores/stores";
import { Course } from "../models/course";
import { Lab } from "../models/lab";
import { lastSegment } from "../utils/lo-utils";
import axios from "axios";
import type { Lo } from "../types/lo-types";
import type { Topic } from "../models/topic";

export const courseService = {
  course: Course,
  courses: new Map<string, Course>(),
  courseUrl: "",

  async getOrLoadCourse(courseId: string): Promise<Course> {
    let course = this.courses.get(courseId);
    if (!course) {
      const courseUrl = "https://" + courseId + "/tutors.json";
      try {
        const response = await axios.get<Lo>(courseUrl);
        course = new Course(response.data, courseId);
        this.courses.set(courseId, course);
        return course;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    return course;
  },

  async readCourse(courseId: string): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId);
    currentCourse.set(course);
    courseUrl.set(course.url);
    week.set(course?.currentWeek);
    this.course = course;
    return course;
  },

  async readTopic(topicId: string): Promise<Topic> {
    const courseId = path.dirname(topicId);
    const course = await this.readCourse(courseId);
    const topic = course.topicIndex.get(lastSegment(topicId));
    currentLo.set(topic.lo);
    return topic;
  },

  async readLab(url: string): Promise<Lab> {
    const courseId = url.substring(0, url.indexOf("/"));
    const course = await this.readCourse(courseId);
    let labId = `/#/lab/${url}`;
    const lastSegment = url.substr(url.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      url = url.substr(0, url.lastIndexOf("/"));
      labId = `/#/lab/${url}`;
    }
    const lo = course.loIndex.get(labId);
    let lab = course.hydratedLabs.get(labId);
    if (!lab) {
      lab = new Lab(course, lo, url);
      course.hydratedLabs.set(labId, lab);
    }
    currentLo.set(lab.lo);
    return lab;
  },

  async readWall(url: string): Promise<Lo[]> {
    const path = url.split("/");
    const course = await this.readCourse(path[1]);
    const wall = course.walls.get(path[0]);
    return wall;
  },

  async readLo(url: string, loType: string): Promise<Lo> {
    const courseId = url.substring(0, url.indexOf("/"));
    const course = await this.readCourse(courseId);
    const ref = `/#/${loType}/${url}`;
    const lo = course.loIndex.get(ref);
    currentLo.set(lo);
    return lo;
  }
};
