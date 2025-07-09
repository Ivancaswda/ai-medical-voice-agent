import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {props} from "@/app/(routes)/dashboard/medical-agent/[sessionId]/[userEmail]/page";
import moment from "moment";
import {Loader2Icon} from "lucide-react";
import ViewReportDialog from "@/app/(routes)/dashboard/_components/ViewReportDialog";

type Props = {
    historyList: props[]
}

const HistoryTable = ({historyList}: Props) => {
    console.log(historyList)
    moment.locale('ru');
    if (historyList.length === 0) {
        console.log('список истории пуст')
        return <Loader2Icon className='animate-spin size-4'/>
    }

    return (
        <Table>
            <TableCaption>Предыдущие отчёты консультаций</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>AI Медицинское Пространство</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действие</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {historyList.map((record: props, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{record?.selectedDoctor?.specialist || "Н/Д"}</TableCell>
                        <TableCell>
                            {record.notes || "Нет заметок"}
                        </TableCell>
                        <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                        <ViewReportDialog record={record}/>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default HistoryTable
