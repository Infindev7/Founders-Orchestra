/**
 * =============================================================================
 * ZOD VALIDATION SCHEMAS
 * =============================================================================
 *
 * Centralised Zod schemas for all API route inputs. Every user-facing field is:
 *   1. Typed with Zod (coercion, optionals, unions, etc.)
 *   2. Constrained (max-length, regex patterns, enums)
 *   3. Sanitised — leading/trailing whitespace is trimmed, and dangerous
 *      characters are stripped from free-text fields.
 *
 * Usage:
 *   import { orchestrateRequestSchema } from "@/lib/validations/schemas";
 *   const parsed = orchestrateRequestSchema.safeParse(body);
 *
 * Owner: Shared
 * =============================================================================
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Strip characters that could be used for injection attacks while preserving
 * legitimate punctuation. Removes: < > { } ` \ and null bytes.
 */
const sanitize = (val: string) =>
  val.replace(/[<>{}\\`\x00]/g, "").trim();

/** A trimmed, sanitised, non-empty string. */
const safeString = (maxLen: number) =>
  z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(maxLen, `Must be at most ${maxLen} characters`)
    .transform(sanitize);

/** A trimmed, sanitised, optional string (may be empty/undefined). */
const optionalSafeString = (maxLen: number) =>
  z
    .string()
    .trim()
    .max(maxLen, `Must be at most ${maxLen} characters`)
    .transform(sanitize)
    .optional()
    .or(z.literal("").transform(() => undefined));

/**
 * Validates a 24-hex-char MongoDB ObjectId string.
 * Prevents NoSQL-injection via malformed IDs.
 */
const mongoIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid project ID format");

// ─────────────────────────────────────────────────────────────────────────────
// Domain schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Startup input — shared between /api/orchestrate and /api/projects POST.
 */
export const startupInputSchema = z.object({
  startupName: safeString(120),
  idea: safeString(5000),
  industry: optionalSafeString(200),
  targetAudience: optionalSafeString(500),
  budget: optionalSafeString(100),
  additionalContext: optionalSafeString(5000),
});

// ─────────────────────────────────────────────────────────────────────────────
// Route-level schemas
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/orchestrate */
export const orchestrateRequestSchema = z.object({
  input: startupInputSchema,
  projectId: mongoIdSchema.optional(),
});

/** POST /api/projects */
export const createProjectSchema = z.object({
  input: startupInputSchema,
});

/** GET /api/projects?id=xxx */
export const getProjectQuerySchema = z.object({
  id: mongoIdSchema.optional(),
});

/** POST /api/report */
export const reportRequestSchema = z.object({
  projectId: mongoIdSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Schema types (inferred) — useful when you need the validated type
// ─────────────────────────────────────────────────────────────────────────────

export type OrchestrateRequestBody = z.infer<typeof orchestrateRequestSchema>;
export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type GetProjectQuery = z.infer<typeof getProjectQuerySchema>;
export type ReportRequestBody = z.infer<typeof reportRequestSchema>;
