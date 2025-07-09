'use client'

import React, {useEffect, useState} from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { Loader2Icon, ArrowRight } from "lucide-react"
import  { doctorAgent } from "@/app/(routes)/dashboard/_components/DoctorAgentCard"
import SuggestedDoctorCard from "@/app/(routes)/dashboard/_components/SuggestedDoctorCard";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/useAuth";
import {props} from "@/app/(routes)/dashboard/medical-agent/[sessionId]/[userEmail]/page";
import {toast} from "sonner";

const AddNewSession = () => {
    const router = useRouter()
    const [note, setNote] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>()
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>()
    const [historyList, setHistoryList] = useState<props[]>()

    const {user} = useAuth()

    console.log(user)

    useEffect(() => {
        getHistoryList()
    }, [])


    const getHistoryList = async () => {

        if (!user) {
            return
        }

        const result = await axios.get(`/api/session-chat?sessionId=all&userEmail=${user?.email}`,)
        console.log(result.data)
        setHistoryList(result.data)

    }
    const OnClickNext = async () => {
        setLoading(true)
        try {
            const result = await axios.post('/api/suggest-doctors', { notes: note })

            console.log('Ответ от сервера:', result)
            const data = result.data
            console.log(data.recommendedDoctors)
            if (data.error) {
                toast.error('Вы исчерпали лимит бесплатных запросов на сегодня. Подождите до завтра или выберите доктора вручную.')
                console.log(data.error)
                return
            }
            console.log(data)
            setSuggestedDoctors(data.recommendedDoctors)
            setLoading(false)
        } catch (err) {
                console.error('Error suggesting doctors:', err)
                toast.error('Произошла ошибка. Попробуйте позже.')

        }
    }
    console.log(suggestedDoctors)
    const onStartConsultation = async () =>{

        if (!user) {
            return
        }

        const result = await axios.post('/api/session-chat', {
            notes: note,
            selectedDoctor: selectedDoctor,
            user: user
        })
        console.log(result.data)
        if (result?.data?.sessionId) {
            console.log(result.data.sessionId)
            router.push(`/dashboard/medical-agent/${result.data.sessionId}/${user?.email}`)
        }

    }

    return (
        <Dialog>
            <DialogTrigger  asChild>
                <Button  >+ Начать консультацию</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Начать новую сессию</DialogTitle>
                <DialogDescription>
                    {loading ? (
                        <AiLoading />
                    ) : !suggestedDoctors ? (
                        <div>
                            <h2 className='font-semibold mb-2'>Добавьте симптом или другие детали жалобы</h2>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className='h-[250px]'
                                placeholder='Добавить информацию здесь...'
                            />
                        </div>
                    ) : (
                        <div>
                            <h1>Выбери доктора</h1>
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                {suggestedDoctors.map((doc, idx) => (
                                    <SuggestedDoctorCard
                                        setSelectedDoctor={setSelectedDoctor}
                                        selectedDoctor={selectedDoctor}
                                        key={idx}
                                        doctorAgent={doc}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </DialogDescription>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Отменить</Button>
                    </DialogClose>
                    {suggestedDoctors ? <Button disabled={!selectedDoctor} onClick={() => onStartConsultation()}>Начать консультацию</Button> : <Button onClick={OnClickNext} disabled={loading}>
                        {loading ? <Loader2Icon className='animate-spin mr-1' /> : <ArrowRight className='mr-1' />}
                        Далее
                    </Button>}

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
const AiLoading = () => (
    <div className="flex flex-col items-center justify-center py-10">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
        <p className="text-lg text-gray-500 text-center">Идёт подбор подходящих докторов, пожалуйста подождите...</p>

        <style jsx>{`
      .loader {
        border-top-color: #3498db;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
    </div>
);
export default AddNewSession
