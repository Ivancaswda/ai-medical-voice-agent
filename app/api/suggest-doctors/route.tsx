import {NextRequest} from "next/server";
import {openai} from "@/config/OpenAiModel";
import {NextResponse} from "next/server";
import {AIDoctorAgents} from "@/shared/list";

export async function POST(req:NextRequest) {
    const {notes} = await req.json()
    try {
        const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [
                {role: 'system', content: JSON.stringify(AIDoctorAgents)},
                {
                    role: 'user',
                    content: `
На основе пользовательских заметок и симптомов: "${notes}", выбери подходящих врачей из следующего списка:

${JSON.stringify(AIDoctorAgents)}

Верни результат в формате строго JSON, с ключом "recommendedDoctors", массивом объектов, каждый из которых содержит:

- id
- specialist
- description
- image 
- agentPrompt
- voiceId 
- subscriptionRequired

Не добавляй объяснений. Верни только JSON.
`
                }
            ]
        })


        const rawResponse = completion.choices[0].message


        const Resp =  rawResponse.content.trim().replace('```json', '').replace('```', '')

        const JSONResp = JSON.parse(Resp)

        return NextResponse.json(JSONResp)
    }catch (error) {
        return NextResponse.json(error)
    }
}