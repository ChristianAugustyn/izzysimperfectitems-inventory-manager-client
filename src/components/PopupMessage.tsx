import React, { FC, useState } from 'react'

interface Props {
    message: string,
    messageType: string,
    show: boolean
}

const PopupMessage: FC<Props> = ({ message, messageType = "info", show }) => {
    const [showPopup, setShowPopup] = useState<boolean>(show);

    return (
        <div className='z-50 absolute left-0 top-0 w-1/3'>
            {
                showPopup ? 
                (
                    <div className={`z-50 alert alert-${messageType} shadow-lg w-full`} onClick={() => setShowPopup(false)}>
                        <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{message}</span>
                        </div>
                    </div>
                )
                :
                null
            }
        </div>
    )
}

export default PopupMessage;