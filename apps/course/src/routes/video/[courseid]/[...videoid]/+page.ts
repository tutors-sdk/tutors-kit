import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";

export const load: PageLoad = async ({ url, params }) => {
  let videoStartEnd = url.searchParams.toString();
  if (videoStartEnd.endsWith("=")) {
    videoStartEnd = videoStartEnd.slice(0, -1);
  }
  const videoId = `${url.pathname}?${videoStartEnd}`;
  const lo = await courseService.readLo(params.courseid, videoId);
  return {
    lo: lo
  };
};
