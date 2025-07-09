import db from "@/config/db"
import { usersTable } from "@/config/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/jwt"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return Response.json({ error: "Missing email or password" }, { status: 400 })
        }

        const existingUsers = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1)

        const user = existingUsers[0]

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return Response.json({ error: "Invalid password" }, { status: 401 })
        }

        const token = generateToken({ email: user.email, userName: user.name })

        return Response.json({
            message: "Logged in",
            token,
            user: {
                email: user.email,
                userName: user.name,
                credits: user.credits ?? 0,
            },
        })
    } catch (err: any) {
        console.error("🚨 Login error:", err)
        return Response.json({ error: "Internal Server Error", details: err.message }, { status: 500 })
    }
}
