'use client'
import React, {useEffect} from 'react'
import HistoryList from "@/app/(routes)/dashboard/_components/HistoryList";

import DoctorsAgentList from "@/app/(routes)/dashboard/_components/DoctorsAgentList";
import {useAuth} from "@/context/useAuth";
import {Loader2Icon} from "lucide-react";
import {useRouter} from "next/navigation";
import AddNewSession from "@/app/(routes)/dashboard/_components/AddNewSession";

const Workspace = () => {
    const {user} = useAuth()
    console.log(user)
    const {  loading } = useAuth()
    const router = useRouter()


    useEffect(() => {
        if (!loading && !user) {
            router.replace('/sign-in');
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className='flex items-center justify-center h-[100vh] w-[85vw]'>
                <Loader2Icon className='animate-spin text-blue-600' />
            </div>
        )
    }

    return (
        <div>
            <div className='flex justify-between'>
                <h2 className='font-bold text-2xl'>Панель управления</h2>
                <AddNewSession/>
            </div>
            <HistoryList/>
            <DoctorsAgentList/>
        </div>
    )
}
export default Workspace
