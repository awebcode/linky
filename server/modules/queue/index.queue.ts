import { CronJob } from "cron";
import { syncOfflineUsers } from "./queue.services";
import { loggerInstance } from "../../config/logger.config";

export const initQueue = async () => {
  loggerInstance.info("**Starting queue...**");
  // Schedule the recurring job every 5 minutes
  const job = new CronJob("*/5 * * * *", async () => {
    await syncOfflineUsers();
  });
  job.start();
};

