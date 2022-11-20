import React, { FC, ReactNode, SetStateAction, useRef, useState } from 'react';
import { Dispatch } from 'react';

interface Props {
    message: string,
    icon: ReactNode,
    onFileChange: Dispatch<SetStateAction<File | undefined>>
}

const FileDragAndDrop: FC<Props> = ({ message, icon, onFileChange }) => {
    const [dragging, setDragging] = useState<boolean>(false);
    const drop = useRef(null);
    const drag = useRef(null);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        const { files } = event.dataTransfer!;

        if (files && files.length) {
            onFileChange(files[0]);
        }
    }

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target !== drag.current) {
            setDragging(true);
        }
    }

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.target === drag.current) {
            setDragging(false);
        }
    }

    return (
        <div ref={drop} className='w-full h-56'>
            {dragging ? <div ref={drag} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} 
            className='bg-gray-300 w-full h-56 flex flex-col items-center justify-center text-sm border-dashed border-2 rounded-xl'>
                <p>{message}</p>
                <span className='mt-5'>
                    {icon}
                </span>
                
            </div>
            :
            <div onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} 
                className='w-full h-56 flex flex-col items-center justify-center text-sm border-dashed border-2 rounded-xl'>
                <p>{message}</p>
                <span className='mt-5'>
                    {icon}
                </span>
            </div>
            }
        </div>
    );
}

export default FileDragAndDrop;