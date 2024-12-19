import helmet from "helmet";

export const helmetConfig = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        scriptSrc: ["'self'"], // Allow scripts from the same origin
        styleSrc: ["'self'"], // Allow styles from the same origin
        imgSrc: ["'self'", "data:"], // Allow images from the same origin and data URIs
        // You can add other directives as needed
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: "same-origin" }, // Allow resources from the same origin
  });
};
