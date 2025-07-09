import {NextRequest, NextResponse} from "next/server";
import db from "@/config/db";
import {v4 as uuidv4} from 'uuid'
import {SessionChatTable} from "@/config/schema";
import {currentUser} from "@clerk/nextjs/server";
import {eq, desc} from "drizzle-orm";
export async function POST(req: NextRequest) {
    const {notes, selectedDoctor, user} = await req.json()

    try {
        const sessionId = uuidv4()
        const result = await db.insert(SessionChatTable).values({
            sessionId:sessionId,
            createdBy: user?.email,
            notes: notes,
            selectedDoctor: selectedDoctor,
            createdOn: (new Date()).toString()
            // @ts-ignore
        }).returning({SessionChatTable})
        return NextResponse.json(result[0]?.SessionChatTable)
    } catch (error) {
       return NextResponse.json(error)
    }
}

export async function GET(req:NextRequest, res: NextResponse) {

    const {searchParams} = new URL(req.url)

    const sessionId = searchParams.get("sessionId")
    const userEmail = searchParams.get('userEmail')
    if (!sessionId || !userEmail) {
        return
    }



    if (sessionId == 'all' ) {
        const result = await db.select()
            .from(SessionChatTable)
            .where(eq(SessionChatTable.createdBy, userEmail))
            .orderBy(desc(SessionChatTable.id));

        return NextResponse.json(result);
    } else {
        const result = await db.select().from(SessionChatTable).where(eq(SessionChatTable.sessionId, sessionId))


        return NextResponse.json(result[0])
    }
}



















