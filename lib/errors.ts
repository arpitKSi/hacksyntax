import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message, "NOT_FOUND");
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(400, message, "BAD_REQUEST");
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource already exists") {
    super(409, message, "CONFLICT");
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = "Validation failed",
    public errors?: any
  ) {
    super(422, message, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(500, message, "INTERNAL_SERVER_ERROR");
  }
}

export class RateLimitError extends ApiError {
  constructor(message = "Too many requests") {
    super(429, message, "RATE_LIMIT_EXCEEDED");
  }
}

/**
 * Format Zod validation errors
 */
export function formatZodErrors(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

/**
 * Global error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          errors: formatZodErrors(error),
        },
      },
      { status: 422 }
    );
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error instanceof ValidationError && { errors: error.errors }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error instanceof Error && error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;
    
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFLICT",
            message: "A record with this value already exists",
          },
        },
        { status: 409 }
      );
    }

    if (prismaError.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Record not found",
          },
        },
        { status: 404 }
      );
    }
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : error instanceof Error
            ? error.message
            : "Unknown error",
      },
    },
    { status: 500 }
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    },
    { status: 200 }
  );
}

/**
 * Async route handler wrapper
 */
export function asyncHandler(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
