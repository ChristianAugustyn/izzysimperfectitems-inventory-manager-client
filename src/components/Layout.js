import React, {useState, useEffect} from 'react'
import NavBar from './NavBar'

const Layout = ({children}) => {
    return (
        <>
            <NavBar/>
            <main className='h-full w-full'>
                {children}
            </main>
            {/* <div className='absolute bottom-0 right-0 left-0 w-full flex flex-row justify-center items-center'>
                <p>izzysimperfectitems@{new Date().getFullYear()}</p>
            </div> */}
        </>
    )
}

export default Layout