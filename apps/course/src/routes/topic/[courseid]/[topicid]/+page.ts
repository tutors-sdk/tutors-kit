import type { PageLoad } from "./$types";
import { courseService } from "tutors-reader-lib/src/services/course-service";

export const load: PageLoad = async ({ params }) => {
  const topic = await courseService.readTopic(params.courseid, params.topicid);
  return {
    topic: topic
  };
};
