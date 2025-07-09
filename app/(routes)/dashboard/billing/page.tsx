import React from 'react'
import {PricingTable} from "@clerk/nextjs";

const Page = () => {
    return (
        <div className='px-10 md:px-24 lg:px-48 '>
            <h2>Join Subscription</h2>
            <PricingTable/>
        </div>
    )
}
export default Page
