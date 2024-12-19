
export const formatRetryTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes > 1 ? "s" : ""}${
      remainingSeconds > 0
        ? ` and ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
        : ""
    }`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours} hour${hours > 1 ? "s" : ""}${
      remainingMinutes > 0
        ? ` and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
        : ""
    }${
      remainingSeconds > 0
        ? ` and ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
        : ""
    }`;
  }
};

