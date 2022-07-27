import React, {useState, useEffect, FC} from 'react'
import NavBar from './NavBar'

type LayoutProps = {
    children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <div>
            <NavBar/>
            <main className='relative h-full w-full' style={{overflowAnchor: 'none'}}>
                {children}
            </main>
            {/* <div className='absolute bottom-0 right-0 left-0 w-full flex flex-row justify-center items-center'>
                <p>izzysimperfectitems@{new Date().getFullYear()}</p>
            </div> */}
        </div>
    )
}

export default Layout