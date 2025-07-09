'use client'
import React, {useEffect, useState} from 'react'

import AddNewSession from "@/app/(routes)/dashboard/_components/AddNewSession";
import axios from "axios";
import HistoryTable from "@/app/(routes)/dashboard/_components/HistoryTable";
import {props} from "@/app/(routes)/dashboard/medical-agent/[sessionId]/[userEmail]/page";
import {useAuth} from "@/context/useAuth";
import {Loader2Icon} from "lucide-react";

const HistoryList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [historyList, setHistoryList] = useState<props[]>([])
    const {user} = useAuth()
    useEffect(() => {
        if (user) {
            getHistoryList()
            console.log('sgagasags')
        }

    }, [user])


    const getHistoryList = async () => {

        if (!user) {
            return
        }
        setLoading(true)

        const result = await axios.get(`/api/session-chat?sessionId=all&userEmail=${user?.email}`)
        console.log(result.data + 'history data!')

        setHistoryList(result.data)
        setLoading(false)
    }

    console.log(historyList.length)
    console.log('sgagsgas')



    return user && !loading ? (
        <div className='mt-10'>
            {historyList.length === 0 ? <div className='flex items-center flex-col p-7 border-dashed rounded-xl justify-center gap-5'>
                    <img src='https://i.pinimg.com/736x/23/ff/99/23ff9974ade813c4ae827d0253d8c4d0.jpg' alt='med-assistant' className='rounded-xl' width={200} height={200}/>
                <h2 className='font-semibold text-xl'>Нет недавних консультаций</h2>
                <p className='text-center text-sm text-gray-700'>Вы пока еще не прокосультировались ни с одним доктором. Нажмите на кнопку начать консультацию или выберите нужного доктора вручную</p>

                <AddNewSession/>
            </div> : <div>
                <HistoryTable historyList={historyList}/>
                <div className='flex items-center flex-col p-7 border-dashed rounded-xl justify-center gap-5'>

                    <AddNewSession/>
                </div>
            </div>}
        </div>
    ) : <div className='text-center flex items-center justify-center'>
        <Loader2Icon className='animate-spin'/>
    </div>
}
export default HistoryList
