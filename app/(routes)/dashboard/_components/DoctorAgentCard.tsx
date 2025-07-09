'use client'
import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import {ArrowRight, Loader2Icon, PhoneCallIcon} from "lucide-react";
import {useAuth} from "@/context/useAuth";
import axios from "axios";
import {useRouter} from "next/navigation";

export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId: string,
    firstMessage: string,
    subscriptionRequired: boolean
}
type props = {
    doctorAgent: doctorAgent
}

const DoctorAgentCard = ({doctorAgent}: props) => {




    const [loading, setLoading] = useState<boolean>()
    const {user} = useAuth()
    const router = useRouter()
    console.log(user)

    const onStartConsultation = async () =>{
        setLoading(true)

        if (!user) {
            return
        }

        const result = await axios.post('/api/session-chat', {
            notes: 'Новая консультация',
            selectedDoctor: doctorAgent,
            user: user
        })
        console.log(result.data)
        if (result?.data?.sessionId) {
            console.log(result.data.sessionId)
            router.push(`/dashboard/medical-agent/${result.data.sessionId}/${user?.email}`)
        }
        setLoading(false)
    }
    console.log(doctorAgent?.image)
    return (
        <div className=''>

            {doctorAgent.image && (
                <div className='relative w-full h-[250px] rounded-xl overflow-hidden'>
                    <img
                        src={doctorAgent.image}
                        alt={doctorAgent.specialist}
                        className='w-full h-[250px] object-cover'
                    />
                </div>
            )}<h2>{doctorAgent.specialist}</h2>
            <p className='line-clamp-2 text-sm text-gray-500'>{doctorAgent.description}</p>
            <Button  onClick={onStartConsultation} className='w-full mt-2'>{loading ? <Loader2Icon className='animate-spin'/> : <PhoneCallIcon/>} Проконсультироваться <ArrowRight/> </Button>
        </div>
    )
}
export default DoctorAgentCard






















