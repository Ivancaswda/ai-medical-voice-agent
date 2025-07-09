import React from 'react'
import DoctorAgentCard from "@/app/(routes)/dashboard/_components/DoctorAgentCard";
import {AIDoctorAgents} from "@/shared/list";

const DoctorsAgentList = () => {
    return (
        <div className='mt-10'>

            <h2 className='font-semibold text-xl'>ИИ Доктор-Специалист</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
                {AIDoctorAgents.map((item:any, index) => (
                    <div key={index}>
                        <DoctorAgentCard doctorAgent={item}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default DoctorsAgentList
