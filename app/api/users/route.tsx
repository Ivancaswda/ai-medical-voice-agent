'use server'
import db from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs/server";
import {usersTable} from "@/config/schema";
import {eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
    const user = await currentUser()

    if (!user) {
        return
    }

    const name = user?.firstName + ' ' + user?.lastName
    const email = user?.primaryEmailAddress?.emailAddress

    if (!name || !email) {
        console.error("❌ Missing user name or email from Clerk")
        return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    try {
        const users = await db.select().from(usersTable)
            .where(eq(usersTable.email, email))

        if (users?.length === 0) {
            const result = await db.insert(usersTable).values({
                name,
                email,
                credits: 10
            }).returning()

            return NextResponse.json(result[0])
        }

        return NextResponse.json(users[0])

    } catch (error) {
        console.error("❌ DB error:", error)
        return NextResponse.json({ error: 'Database insert failed', detail: error }, { status: 500 })
    }
}

