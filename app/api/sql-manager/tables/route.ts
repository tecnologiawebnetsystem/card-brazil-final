import { NextResponse } from "next/server"
import { accessError, requireSqlManagerAccess } from "@/back-end/lib/sql-manager-auth"

export async function GET() {
  try {
    await requireSqlManagerAccess()
    return NextResponse.json(
      { success: false, error: "A inspeção global de tabelas foi desabilitada para evitar exposição de metadados entre administradoras." },
      { status: 501 },
    )
  } catch (error) {
    console.error("[v0] SQL Manager tables error", error)
    return accessError(error)
  }
}
