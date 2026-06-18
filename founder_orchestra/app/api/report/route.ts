/**
 * =============================================================================
 * API ROUTE — /api/report
 * =============================================================================
 *
 * Generates a PDF report from a project's agent outputs.
 *
 * HOW IT WORKS:
 * 1. Frontend sends a POST request with the project ID
 * 2. We fetch the project from MongoDB
 * 3. We use @react-pdf/renderer to generate a PDF buffer
 * 4. We return the PDF as a downloadable file
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Project } from "@/lib/db/models/project";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument } from "@/lib/pdf/report-template";
import React from "react";
import { validateBody } from "@/lib/validations/helpers";
import { reportRequestSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    // ── Parse & validate input ────────────────────────────────────────────
    const validationResult = await validateBody(request, reportRequestSchema);
    if (!validationResult.success) return validationResult.response;
    const { projectId } = validationResult.data;

    // ── Fetch project from database ───────────────────────────────────────
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // ── Check that at least one agent has completed ───────────────────────
    const completedAgents = Object.values(project.agents || {}).filter(
      (agent: { status?: string }) => agent?.status === "completed"
    );

    if (completedAgents.length === 0) {
      return NextResponse.json(
        {
          error:
            "No completed agent outputs found. Run the orchestration first.",
        },
        { status: 422 }
      );
    }

    // ── Generate PDF ─────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const documentElement = React.createElement(ReportDocument, {
      project: {
        _id: project._id?.toString(),
        input: project.input,
        agents: project.agents,
        overallStatus: project.overallStatus,
        createdAt: project.createdAt?.toISOString?.() ?? "",
        updatedAt: project.updatedAt?.toISOString?.() ?? "",
      },
    }) as any; // Cast required: @react-pdf/renderer types expect DocumentProps at top level

    const pdfBuffer = await renderToBuffer(documentElement);

    // ── Sanitize the filename ────────────────────────────────────────────
    const safeName = project.input.startupName
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Convert Node Buffer to Uint8Array for web-standard Response compatibility
    const pdfBytes = new Uint8Array(pdfBuffer);

    // ── Return PDF as a downloadable file ────────────────────────────────
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-report.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[/api/report] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}
