'use client'
import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";
import {doctorAgent} from "@/app/(routes)/dashboard/_components/DoctorAgentCard";
import {Circle, Loader2Icon, PhoneCallIcon, PhoneOff} from "lucide-react";

import {Button} from "@/components/ui/button";
import Vapi from '@vapi-ai/web';
import {useAuth} from "@/context/useAuth";

export type props = {
    id: number,
    notes:string,
    sessionId:string,
    report: JSON,
    selectedDoctor:doctorAgent,
    createdOn: string,
    createdBy: string
}
type messages = {
    role: string,
    text:string
}

const MedicalVoiceAgent = () => {
    const {sessionId} = useParams()
    const [reportLoading, setReportLoading] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [finalCallDuration, setFinalCallDuration] = useState<number | null>(null);

    const [loading, setLoading] = useState<boolean>()
    const [sessionDetail, setSessionDetail] = useState<props>()
    const [callStarted, setCallStarted] = useState<boolean>(false)
    const [vapiInstance, setVapiInstance] = useState<any>()
    const [currentRole, setCurrentRole] = useState<string | null>('')
    const [messages, setMessages] = useState<messages[]>([])
    const [liveTranscript, setLiveTranscript] = useState<string>()
    const router = useRouter()
    const {user} = useAuth()
// Start voice conversation

    if (!sessionId) {
        return <Loader2Icon className='animate-spin text-center'/>
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    useEffect(() => {
        if (sessionId) {
            getSessionDetails()
        }
    }, [sessionId])

    const getSessionDetails = async () => {

        if (!user) {
            return
        }

        console.log(user.email)
        const result = await axios.get(`/api/session-chat?sessionId=${sessionId}&userEmail=${user?.email}`)
        console.log(result.data)
        setSessionDetail(result.data)
    }
    console.log(sessionDetail)

    const startCall = async () => {
        console.log(sessionDetail)
        try {

            if (!user) {
                console.error("User detail not ready");
                return
            }

            setLoading(true)
            if (!sessionDetail || !sessionDetail?.selectedDoctor?.voiceId) {
                console.error("Session detail not ready");
                return;
            }

            if (!sessionDetail?.selectedDoctor?.voiceId) {
                console.error("Missing voiceId in selectedDoctor");
                return;
            }
            const vapi = new Vapi('161eae17-df00-4f7c-b3a8-a432e2f198fb');
            setVapiInstance(vapi)

            const VapiAgentConfig = {
                name: 'Голосовой медицинский AI-доктор',
                firstMessage: sessionDetail?.selectedDoctor?.firstMessage ||  'Здравствуйте! Я ваш голосовой медицинский помощник. Расскажите, что вас беспокоит сегодня?',
                transcriber: {
                    provider: 'deepgram',
                    language: 'ru' // важная часть — транскрипция на русском
                },
                voice: {
                    provider: 'azure',
                    voiceId: 'ru-RU-DmitryNeural', // русская голосовая модель
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: sessionDetail?.selectedDoctor?.agentPrompt || 'Вы доброжелательный AI медицинский помощник. Общайтесь с пользователем по-русски, помогайте ему кратко и понятно.'
                        }
                    ]
                }
            };
            console.log("Starting Vapi call with config:", VapiAgentConfig);
            await vapi.start(VapiAgentConfig);


            // Listen for events
            vapi.on('call-start', handleCallStart);
            vapi.on('call-end', handleCallEnd);
            vapi.on('message', (message) => {
                if (message.type === 'transcript') {
                    const {role, transcriptType, transcript} = message
                    if (transcriptType === 'partial') {
                        setLiveTranscript(transcript)
                        setCurrentRole(role)
                    } else if (transcriptType === 'final') {
                        setMessages((prev) => [...prev, {role:role, text: transcript}])
                        setLiveTranscript("")
                        setCurrentRole(null)
                    }
                    console.log(`${message.role}: ${message.transcript}`);
                }
            });

            vapi.on('speech-start', () => {
                console.log('Assistant started speaking')
                setCurrentRole('assistant')
            })
            vapi.on('speech-end', () => {
                console.log('Assistant finished speaking')
                setCurrentRole('user')
            })
            vapi.on('error', (error) => {
                console.error('Vapi Error Event:', error);
            });
        } catch (error) {
            console.error("❌ Error starting Vapi call:", error);

        } finally {
            setLoading(false)
        }
    }
    const handleCallStart = () => {
        setCallStarted(true)
        console.log('call has started')

        const interval = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval);
    }

    const handleCallEnd = () => {
        setCallStarted(false)
        console.log('call has ended')
        if (timerInterval) clearInterval(timerInterval);
        setCallDuration(callDuration);

    }
    const endCall = async () => {
        setLoading(true);

        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Остановка звонка
            if (vapiInstance) {
                await vapiInstance.stop();
                vapiInstance.off('call-start', () => {
                    setCallStarted(false)
                    if (timerInterval) clearInterval(timerInterval);
                    setCallDuration(callDuration);
                });
                vapiInstance.off('call-end', () => {
                    setCallStarted(true)
                    if (timerInterval) clearInterval(timerInterval);
                    setCallDuration(callDuration);
                });
            }

            // Запуск загрузки отчета
            setReportLoading(true);

            // Генерация отчета
            const reportResult = await GenerateReport(finalCallDuration ?? callDuration);

            if (!reportResult) {
                toast.error("Failed to generate medical report");
            }

            setReportLoading(false);

            // Очистка состояния
            setCallStarted(false);
            setVapiInstance(null);

            toast.success('Звонок завершен!');
            router.replace("/dashboard");

        } catch (error) {
            console.error("Error ending call:", error);
            toast.error("Не удалось завершить звонок или сгенерировать отчёт");
            setReportLoading(false);
        } finally {
            setLoading(false);
        }
    };



    const GenerateReport = async (durationInSec: number) => {
        try {
            const result = await axios.post('/api/medical-report', {
                messages: messages,
                sessionDetail: sessionDetail,
                sessionId: sessionId,
                duration: formatTime(durationInSec)
            })

            console.log("Report generated:", result.data)
            return result.data
        } catch (error) {
            console.error(" Failed to generate report:", error)
            return null
        }
    }

    console.log(callDuration)

    return  (
        <div className='p-5 border rounded-xl bg-secondary'>
            <div className='flex justify-between items-center
            '>
                {!callStarted ? <h2 className={'p-1 px-2 border rounded-md flex gap-2 items-center'}>
                    <Circle className='bg-red-500 rounded-full'/> Не подключено
                </h2> : <h2 className={'p-1 px-2 border rounded-md flex gap-2 items-center'}>
                    <Circle className='bg-green-500 rounded-full'/>Подключено
                </h2>}

                <h2 className='font-semibold text-gray-400'>
                    {formatTime(callDuration)}
                </h2>
            </div>
            {sessionDetail && <div className='flex items-center flex-col mt-10'>
                <img className='w-[120px] h-[120px] object-cover rounded-full' src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.id}/>
                <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
                <p className='text-sm text-gray-400'></p>

                <div
                    className='mt-12 overflow-y-auto h-[200px] flex flex-col items-start px-10 md:px-20 lg:px-52 w-full'>
                    {messages?.slice(-4)?.map((msg: messages, index) => (
                        <div key={index}>
                            <h2 className='text-gray-400 text-left'>{msg.role} : {msg.text}</h2>
                        </div>
                    ))}
                    <h2 className='text-gray-400'>Субтитры разговора: {currentRole == 'assistant' && 'Говорит доктор'} {currentRole === 'user' && 'Говорит пациент'}</h2>
                    {liveTranscript && liveTranscript?.length > 0 &&
                        <h2 className='text-lg text-left'>{currentRole} : {liveTranscript}</h2>}
                </div>
                    {reportLoading && (
                        <div className="flex flex-col items-center justify-center mt-10">
                            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
                            <p className="text-lg text-gray-500">Подождите, ваш отчёт генерируется...</p>
                            <p className='text-gray-700 text-sm'>это может занять 2-3 минуты.</p>
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
                    )}


                {!callStarted ? <Button disabled={loading} onClick={startCall} className='mt-20'> {loading ? <Loader2Icon className='animate-spin'/> : <PhoneCallIcon/>} Начать звонок</Button> : <Button disabled={loading} onClick={endCall} variant='destructive' className='mt-20'>
                    {loading ? <Loader2Icon className='animate-spin'/> : <PhoneOff />}
                    {loading ? "Завершение..." : "Завершить"}
                </Button>}

            </div>}

        </div>
    )
}



export default MedicalVoiceAgent
