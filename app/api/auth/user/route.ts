// app/api/auth/me/route.ts
import {verifyToken} from "@/lib/jwt";
import db from "@/config/db"
import { usersTable } from "@/config/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const decoded = verifyToken(token) as { email: string }
        console.log(decoded)
        const users = await db.select().from(usersTable).where(eq(usersTable.email, decoded.email)).limit(1)
        console.log(users)
        const user = users[0]

        if (!user) {
            return new Response("User not found", { status: 404 })
        }

        return Response.json({
            user: {
                email: user.email,
                userName: user.name,
                credits: user.credits ?? 0,
            },
        })
    } catch (err: any) {
        return new Response("Invalid token", { status: 401 })
    }
}
