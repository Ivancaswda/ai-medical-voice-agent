import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
    DialogContent,
} from "@/components/ui/dialog";
import {props} from "@/app/(routes)/dashboard/medical-agent/[sessionId]/[userEmail]/page";
import moment from "moment";
import {TableCell} from "@/components/ui/table";

type prop = {
    record: props
}

const ViewReportDialog = ({record}: prop) => {
    console.log(record?.report)

    return (
        <Dialog >
            <DialogTrigger asChild>
                <TableCell className="text-right text-blue-600 cursor-pointer hover:underline">
                    Посмотреть полный отчёт
                </TableCell>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle className="text-center text-3xl font-bold mb-4">
                        Отчёт по медицинской консультации AI
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6  h-[80vh] text-sm overflow-y-auto">
                    {/* Информация о докторе */}
                    <section>
                        <h3 className="font-semibold text-lg text-blue-500 mb-1">Информация о докторе</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p><span className="font-medium">Специализация:</span> {record?.selectedDoctor?.specialist}</p>
                            <p><span className="font-medium">Описание:</span> {record?.selectedDoctor?.description}</p>
                        </div>
                    </section>

                    {/* Информация о консультации */}
                    <section>
                        <h3 className="font-semibold text-lg text-blue-500 mb-1">Информация о консультации</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p><span
                                className="font-medium">Дата:</span> {moment(new Date(record?.createdOn)).format("D MMMM YYYY, H:mm")}
                            </p>
                            <p><span className="font-medium">ID сессии:</span> {record?.sessionId}</p>
                            <p><span className="font-medium">Продолжительность :</span> {record?.callDuration}
                            </p>
                        </div>
                    </section>

                    {/* Заметки пациента */}
                    <section>
                    <h3 className="font-semibold text-lg text-blue-500 mb-1">Заметки пациента</h3>
                        <p className="bg-gray-100 p-3 rounded text-sm text-gray-700">{record?.notes || "Заметок не добавлено."}</p>
                    </section>

                    {/* Отчёт / Разговор AI */}
                    <section>
                        <h3 className="font-semibold text-lg text-blue-500 mb-1">Отчёт AI</h3>
                        {record?.report && typeof record.report === 'object' && (
                            <div className="bg-gray-100 p-4 rounded text-sm text-gray-800 space-y-2">
                                <p><span className="font-medium">Доктор:</span> {record.report.agent}</p>
                                <p><span className="font-medium">Пользователь:</span> {record.report.user}</p>
                                <p><span className="font-medium">Время:</span> {moment(new Date(record?.report.timestamp)).format("D MMMM YYYY, H:mm")}</p>
                                <p><span className="font-medium">Главная жалоба:</span> {record.report.chiefComplaint}</p>
                                <p><span className="font-medium">Резюме:</span> {record.report.summary}</p>
                                <p><span className="font-medium">Продолжительность:</span> {record.report.duration}</p>
                                <p><span className="font-medium">Тяжесть:</span> {record.report.severity}</p>

                                <div>
                                    <p className="font-medium">Симптомы:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {record.report.symptoms?.map((symptom: string, index: number) => (
                                            <li key={index}>{symptom}</li>
                                        ))}
                                    </ul>
                                </div>

                                {record.report.medicationsMentioned?.length > 0 && (
                                    <div>
                                        <p className="font-medium">Упомянутые лекарства:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            {record.report.medicationsMentioned.map((med: string, index: number) => (
                                                <li key={index}>{med}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <p className="font-medium">Рекомендации:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {record.report.recommendations?.map((rec: string, index: number) => (
                                            <li key={index}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg text-blue-500 mb-1">Разговор с ИИ</h3>


                        {record?.conversation && record?.conversation.length > 0 && (
                            <div
                                className="bg-gray-100 p-3 rounded space-y-2 text-sm text-gray-800 max-h-96 overflow-auto">
                                {record?.conversation.map((msg, idx) => (
                                    <div key={idx}
                                         className={`p-2 rounded ${msg.role === 'user' ? 'bg-white' : 'bg-blue-50'}`}>
                                        <span
                                            className="font-semibold">{msg.role === 'user' ? '🧑 Вы' : '🤖 AI'}:</span> {msg.text}
                                    </div>
                                ))}
                            </div>
                        )}

                    </section>

                </div>
            </DialogContent>

        </Dialog>
    )
}

export default ViewReportDialog
