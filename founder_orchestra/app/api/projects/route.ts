/**
 * =============================================================================
 * API ROUTE — /api/projects
 * =============================================================================
 *
 * CRUD operations for projects:
 * - GET  /api/projects        → List all projects for the current user
 * - GET  /api/projects?id=xxx → Get a specific project
 * - POST /api/projects        → Create a new project (without running agents)
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Project } from "@/lib/db/models/project";
import { validateBody, validateQuery } from "@/lib/validations/helpers";
import { getProjectQuerySchema, createProjectSchema } from "@/lib/validations/schemas";

// ── GET: Fetch projects ─────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const validationResult = validateQuery(searchParams, getProjectQuerySchema);
    if (!validationResult.success) return validationResult.response;
    const { id: projectId } = validationResult.data;

    if (projectId) {
      // ── Get a specific project ──────────────────────────────────────
      const project = await Project.findById(projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }

    // ── List all projects ─────────────────────────────────────────────
    // TODO (Team Member C): Filter by authenticated user's ID
    const projects = await Project.find({})
      .sort({ createdAt: -1 }) // Newest first
      .limit(20)               // Don't return too many
      .select("input.startupName overallStatus createdAt updatedAt"); // Only needed fields

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[/api/projects GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── POST: Create a new project ──────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    await connectDB();

    const validationResult = await validateBody(request, createProjectSchema);
    if (!validationResult.success) return validationResult.response;
    const body = validationResult.data;

    const project = await Project.create({
      userId: "anonymous", // TODO: Get from auth session
      input: body.input,
      agents: {},
      overallStatus: "not-started",
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[/api/projects POST] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
