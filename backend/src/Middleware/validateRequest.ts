import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError, ZodIssue } from "zod";

interface ValidationError {
  field: string;
  message: string;
}

export const validateRequest =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors: ValidationError[] = (error.issues as ZodIssue[]).map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })
        );

        return res.status(400).json({
          success: false,
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
