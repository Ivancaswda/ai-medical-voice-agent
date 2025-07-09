import db from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const { email, password, userName } = await req.json();

        if (!email || !password || !userName) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUsers = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (existingUsers.length > 0) {
            return Response.json({ error: "User already exists" }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 10);

        await db.insert(usersTable).values({
            name: userName,
            email,
            password: hashed,
            credits: 10
        });

        const token = generateToken({ email, userName });

        return Response.json({ message: "Registered", token });
    } catch (err: any) {
        console.error("🚨 Registration error:", err);
        return Response.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
