import { ZodError } from "zod";
import { AppError } from "../middlewares/errors-handle.middleware";
import { Prisma } from "@prisma/client"; // Prisma error types

// Simplified function to format Zod errors into user-friendly messages
const formatZodErrors = (errors: ZodError["issues"]): string =>
  errors
    .map(
      (e) =>
        `${e.path.join(".")} ${
          e.message === "Required" ? "is required" : `: ${e.message}`
        }`
    )
    .join(", ");

// Function to format error messages
export const formatErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err;

  if (err instanceof ZodError) return formatZodErrors(err.errors);

  if (err instanceof Prisma.PrismaClientKnownRequestError) return formatPrismaError(err);

  if (err instanceof AppError) return err.message || "Internal Server Error";

  if (err instanceof Error) return err.message;

  return "An unexpected error occurred.";
};

// Function to extract status code from the error
export const getStatusCode = (err: unknown): number => {
  if (err instanceof AppError) return err.statusCode;
  if (err instanceof Prisma.PrismaClientKnownRequestError) return 400; // Bad Request for Prisma errors
  return 500; // Default to internal server error
};

// Function to extract the error line from a stack trace
export const extractErrorLine = (stack: string | undefined): string =>
  stack?.split("\n")[1]?.trim() || "Unknown error line";

// Function to format Prisma errors with specific meta information
const formatPrismaError = (err: Prisma.PrismaClientKnownRequestError): string => {
 console.log({ errCode:err.code, errMeta:err.meta })
  const Default_Field_Type = "field";
  switch (err.code) {
    case "P2002": {
      const target = err.meta?.target || Default_Field_Type;
      return `Duplicate value: A record already exists with this unique ${target}.`;
    }
    case "P2003": {
      const field = err.meta?.field_name || "foreign key field";
      return `Foreign key constraint failed on ${field}: Check related records.`;
    }
    case "P2004": {
      const constraint = err.meta?.constraint || "unknown constraint";
      return `Constraint violation: Invalid input for ${constraint}.`;
    }
    case "P2025": {
      const cause = err.meta?.cause || "requested operation";
      return `Record not found: Unable to perform ${cause}.`;
    }
    case "P2000": {
      const field = err.meta?.column_name || Default_Field_Type;
      return `Value too long for ${field}: Adjust input length.`;
    }
    case "P2011": {
      const field = err.meta?.column_name || Default_Field_Type;
      return `Null constraint violation: ${field} cannot be null.`;
    }
    case "P2012": {
      const field = err.meta?.column_name || Default_Field_Type;
      return `Missing required value for ${field}.`;
    }
    case "P2013": {
      const missingArgument = err.meta?.argument_name || "parameter";
      return `Missing argument: ${missingArgument} is required in the query.`;
    }
    case "P2014": {
      const relation = err.meta?.relation_name || "relation";
      return `Relation violation: Issue in ${relation}, check related table constraints.`;
    }
      case "P2015": {
        const field = err.meta?.column_name || Default_Field_Type;
        return `Value too long for ${field}: Adjust input length.`;
    }
      case "P2023": {
        return err?.meta?.message as string|| "Record not found";
      }
    default:
      return `Database error: ${err.message}`;
  }
};
