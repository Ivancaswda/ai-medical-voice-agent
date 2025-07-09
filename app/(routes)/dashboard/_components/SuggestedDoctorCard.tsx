import React from 'react'
import {doctorAgent} from "@/app/(routes)/dashboard/_components/DoctorAgentCard";


type props = {
    doctorAgent: doctorAgent,
    setSelectedDoctor: any,
    selectedDoctor: doctorAgent
}

const SuggestedDoctorCard = ({doctorAgent, setSelectedDoctor, selectedDoctor}: props) => {

    console.log(doctorAgent)


    return (
        <div onClick={() => setSelectedDoctor(doctorAgent)} className={`flex shadow p-3 gap-4 items-center border ${selectedDoctor?.id === doctorAgent?.id && 'border-blue-500 transition-all'} rounded-2xl hover:bg-blue-500 cursor-pointer `}>
            <img className='w-[50px] h-[50px] rounded-4xl object-cover '
                   alt={doctorAgent?.specialist} src={doctorAgent?.image}/>
            <div className='flex flex-col gap-2 items-start'>
                <h2 className='font-semibold text-sm '>{doctorAgent?.specialist}</h2>
                <p className='text-xs line-clamp-2'>{doctorAgent?.description}</p>
            </div>

        </div>
    )
}
export default SuggestedDoctorCard
