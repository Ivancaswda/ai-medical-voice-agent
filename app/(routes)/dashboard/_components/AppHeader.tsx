'use client'
import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/useAuth";
import Image from "next/image";
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
        }

    ]
 //   const {logout} = useAuth()

    return (
        <div className='flex flex-row items-center mb-10 justify-between p-4 shadow px-10 md:px-20 lg:px-40 '>

                <Image width={70} height={70}  className='rounded-xl w-[70px] h-[60px]'
                    src="/logo.png" 
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
