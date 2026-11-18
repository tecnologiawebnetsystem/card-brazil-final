import { NextResponse } from "next/server"
import { accessError, requireSqlManagerAccess } from "@/back-end/lib/sql-manager-auth"

export async function POST() {
  try {
    await requireSqlManagerAccess()
    return NextResponse.json(
      { success: false, error: "Alterações em tabelas arbitrárias foram desabilitadas por segurança." },
      { status: 501 },
    )
  } catch (error) {
    return accessError(error)
  }
}
