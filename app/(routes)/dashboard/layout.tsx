'use client'
import React from 'react'
import AppHeader from "@/app/(routes)/dashboard/_components/AppHeader";


const Layout = ({children}:Readonly<{children: React.ReactNode}>) => {

    return (
        <div>
            <AppHeader/>
            <div className='px-10 md:px-20 lg:px-40'>
                {children}
            </div>


        </div>
    )
}
export default Layout
