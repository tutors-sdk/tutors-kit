import { analyticsService } from "./analytics-service";
import type { WebAuth } from "auth0-js";
import type { Course } from "../models/course";
import { encrypt, fromLocalStorage, isAuthenticated, setSession, toLocalStorage } from "../utils/auth-utils";
import type { User } from "../types/auth-types";

export function checkAuth(course: Course, auth0: WebAuth) {
  let status = true;
  if (course.authLevel > 0) {
    if (!isAuthenticated()) {
      status = false;
      localStorage.setItem("course_url", course.url);
      login(auth0);
    } else {
      const user = fromLocalStorage();
      analyticsService.reportLogin(user, course.url);
    }
  }
  return status;
}

export function handleAuthentication(result: string, auth0: WebAuth, router: any): void {
  const authResult = new URLSearchParams(result);
  const accessToken = authResult.get("access_token");
  const idToken = authResult.get("id_token");
  if (accessToken && idToken) {
    auth0.client.userInfo(accessToken, function (err: Error, user: User) {
      if (err) {
        console.log("Error loading the Profile", err);
      }
      toLocalStorage(user);
      const url = localStorage.getItem("course_url");
      user.userId = encrypt(user.email);
      analyticsService.reportLogin(user, url);
      setSession(authResult);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router(`/course/${url}`);
    });
  }
}

function login(auth0) {
  auth0.authorize({ prompt: "login", scope: "openid profile email" });
}
