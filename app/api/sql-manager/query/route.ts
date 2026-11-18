import { NextRequest, NextResponse } from "next/server"
import { accessError, requireSqlManagerAccess } from "@/back-end/lib/sql-manager-auth"

function unavailable() {
  return NextResponse.json(
    { success: false, error: "Consultas SQL arbitrárias foram desabilitadas por segurança. Use os endpoints com escopo da administradora." },
    { status: 501 },
  )
}

export async function POST() {
  try {
    await requireSqlManagerAccess()
    return unavailable()
  } catch (error) {
    return accessError(error)
  }
}

export async function GET() {
  try {
    await requireSqlManagerAccess()
    return unavailable()
  } catch (error) {
    return accessError(error)
  }
}
