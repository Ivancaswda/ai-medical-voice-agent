import {NextRequest, NextResponse} from "next/server";
import {openai} from "@/config/OpenAiModel";
import {eq} from "drizzle-orm";
import db from "@/config/db";
import {SessionChatTable} from "@/config/schema";


const REPORT_GEN_PROMPT = `
Ты — голосовой AI-медицинский агент, завершивший разговор с пользователем. 
Сгенерируй структурированный медицинский отчёт на **русском языке**, строго в формате JSON:

{
  "sessionId": "строка",
  "agent": "AI терапевт",
  "user": "строка",
  "timestamp": "строка",
  "chiefComplaint": "строка",
  "summary": "строка",
  "symptoms": ["симптом1", "симптом2"],
  "duration": "строка",
  "severity": "строка",
  "medicationsMentioned": ["препарат1", "препарат2"],
  "recommendations": ["рекомендация1", "рекомендация2"]
}

Без объяснений. Только JSON. 
`
export async function POST(req: NextRequest) {
    const {sessionId, sessionDetail, messages, duration} = await req.json()

    try {
        const UserInput = `AI Doctor Agent Info: ${JSON.stringify(sessionDetail)}, Duration: ${duration}, Conversation: ${JSON.stringify(messages)}`

        const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [
                {role: 'system', content: REPORT_GEN_PROMPT},
                {role: 'user', content: UserInput}
            ]
        })
        const rawResp = completion.choices[0].message

        const Resp = rawResp.content.trim().replace('```json', '').replace('```', '')
        const JSONResp = JSON.parse(Resp)
        console.log(JSONResp)
         await db.update(SessionChatTable).set({
             report: JSONResp,
             conversation: messages,
             callDuration: duration // duration в формате MM:SS
        }).where(eq(SessionChatTable.sessionId, sessionId))
        return NextResponse.json(JSONResp)
    } catch (error) {
        return NextResponse.json(error)
    }
}