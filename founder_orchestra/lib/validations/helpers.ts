/**
 * =============================================================================
 * API VALIDATION HELPERS
 * =============================================================================
 *
 * Utility functions that wrap Zod parsing and produce consistent JSON error
 * responses. Use these in API route handlers to avoid repeating try/catch +
 * formatting logic.
 *
 * Usage:
 *   import { validateBody } from "@/lib/validations/helpers";
 *   const result = await validateBody(request, mySchema);
 *   if (!result.success) return result.response;
 *   const data = result.data; // typed & sanitised
 *
 * Owner: Shared
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { type ZodSchema, ZodError } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ValidationSuccess<T> = { success: true; data: T };
type ValidationFailure = { success: false; response: NextResponse };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

// ─────────────────────────────────────────────────────────────────────────────
// Error formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a ZodError into a human-readable error response.
 * Returns an object with a top-level `error` message and a `details` array
 * listing each field-level problem.
 */
function formatZodError(error: ZodError<any>) {
  const details = error.issues.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));

  return {
    error: "Validation failed",
    details,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse and validate a JSON request body against a Zod schema.
 *
 * Handles:
 * - Malformed JSON (returns 400 with a clear message)
 * - Schema validation failures (returns 400 with field-level details)
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<ValidationResult<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      ),
    };
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(formatZodError(result.error), {
        status: 400,
      }),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Parse and validate URL search params against a Zod schema.
 *
 * Converts the URLSearchParams into a plain object before validating.
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>,
): ValidationResult<T> {
  // Convert URLSearchParams to a plain object (single values only)
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const result = schema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(formatZodError(result.error), {
        status: 400,
      }),
    };
  }

  return { success: true, data: result.data };
}
