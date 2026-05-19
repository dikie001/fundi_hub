import { db } from "./db"

export async function logAudit({
  action,
  details,
  req,
  userId,
}: {
  action: string
  details: string
  req?: Request
  userId?: string
}) {
  try {
    let ip: string | undefined
    if (req) {
      ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined
      if (ip && ip.includes(",")) ip = ip.split(",")[0].trim()
    }

    await db.auditLog.create({
      data: {
        action,
        details,
        ipAddress: ip,
        userId,
      },
    })
  } catch (err) {
    // best-effort logging; don't crash the request
    console.error("logAudit error:", err)
  }
}

export default logAudit
