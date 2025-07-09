'use client'
import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/useAuth";

const AppHeader = () => {
    const {logout} = useAuth()

    const menuOptions = [
        {
            id: 1,
            name: 'Главная',
            path: "/dashboard"
        },
        {
            id: 2,
            name: 'История',
            path: "/dashboard/history"
        },
        {
            id: 3,
            name: 'Pricing',
            path: "/dashboard/billing"
        },
        {
            id: 4,
            name: 'Профиль',
            path: "/dashboard/profile"
        },

    ]
 //   const {logout} = useAuth()

    return (
        <div className='flex flex-row items-center mb-10 justify-between p-4 shadow px-10 md:px-20 lg:px-40 '>

                <img  className='rounded-xl w-[70px] h-[60px]'
                     src='https://sdmntprwestus2.oaiusercontent.com/files/00000000-7878-61f8-b738-80063fd15100/raw?se=2025-07-04T06%3A46%3A12Z&sp=r&sv=2024-08-04&sr=b&scid=95719c9c-3a3d-5bcc-bc73-d14de4f3da71&skoid=24a7dec3-38fc-4904-b888-8abe0855c442&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-03T15%3A10%3A33Z&ske=2025-07-04T15%3A10%3A33Z&sks=b&skv=2024-08-04&sig=OSOUyJ12x4J6FHue0Ya/sruOcs2tlCQPAAPutPouHvM%3D'
                     alt="logo.png"/>

            <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <div key={index}>
                        <Link href={option.path}>
                            <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                        </Link>
                    </div>
                ))}
            </div>
            <Button onClick={logout}>
                Выйти
            </Button>
        </div>
    )
}
export default AppHeader
