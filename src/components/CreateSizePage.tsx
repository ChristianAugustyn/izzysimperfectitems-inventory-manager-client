import { RouteComponentProps } from '@reach/router';
import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Size } from '../interfaces';
import Layout from './Layout';

interface CheckedSize {
    [id: string]:  boolean
}

const formateDate = (timeStamp: string): string => {
    return new Date(timeStamp).toLocaleString();
}

const CreateSizePage: FC<RouteComponentProps> = () => {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [sizeChecked, setSizeChecked] = useState({} as CheckedSize);
    const [newSize, setNewSize] = useState<Size>({} as Size);

    const getSizesAsync = async () => {
        console.log('get sizes async');
        try {
            let res: AxiosResponse = await axios.get(`http://localhost:5000/api/v2/sizes`);
            
            if (res.status !== 200) {
                console.error(res.statusText);
            }

            setSizes(res.data);

            res.data.forEach((size: Size ) => {
                sizeChecked[size.id] = false;
            });

            setSizeChecked({...sizeChecked});
        } catch(err) {
            console.error(err);
        }
    }
    
    useEffect(() => {
        getSizesAsync();
    }, []);

    const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
        const { id } = event.target;
        console.log('handle checked');
        setSizeChecked({
            ...sizeChecked,
            [id]: !sizeChecked[id]
        });
    }

    const handleCheckAll = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('handle check all');
        const { checked } = event.target;
        let newSizeChecked: CheckedSize = {};
        Object.entries(sizeChecked).forEach(([id, checkedValue]: [string, boolean]) => newSizeChecked[id] = checked);
        setSizeChecked({...newSizeChecked});
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setNewSize({
            ...newSize,
            [id]: value
        });
    }
    const createNewSize = async () => {
        console.log('handle checked create new size');
        try {
            let res: AxiosResponse = await axios.post(`http://localhost:5000/api/v2/sizes`, newSize);

            console.log(res);
            if (res.status !== 200) {
                alert("There was an issue and the size could not be created");
                return;
            }

            alert("success");
            setNewSize({...newSize, sizeValue: ''});
            getSizesAsync();
        } catch(err) {
            console.error(err);
        }
    }

    const deleteSizes = async () => {
        //get all selected sizes into an array
        console.log('handle delete sizes');
        let sizesToDelete: string[] = Object.entries(sizeChecked)
            .filter(([id, checked]) => checked === true)
            .map(([id, checked]: [string, boolean]): string => id);
        //build query string
        let queryString = '';
        sizesToDelete.forEach(sizeId => queryString += `id=${sizeId}&`);
        
        try {
            let res: AxiosResponse = await axios.delete(`http://localhost:5000/api/v2/sizes?${queryString}`);
            
            if (res.status !== 200) {
                alert("there was an issue deleting the sizes");
                return;
            }

            alert('success');
            getSizesAsync();

        } catch (err) {
            console.error(err);
        }
        
    }

    

    return (
        <Layout>
            <div className='container mx-auto flex flex-col flex-wrap relative w-full h-full p-4'>
                <div className='w-full'>
                    <div className='form-control w-full mb-4'>
                        <label className='label'>
                            <span className="label-text">Size Value</span>
                        </label>
                        <div className='input-group'>
                            <input id='sizeValue' type="text" placeholder="Type here" className="input input-bordered w-full" onChange={handleChange} value={newSize.sizeValue}/>
                            <button className="btn btn-accent" onClick={createNewSize}>Create Size</button>
                        </div>
                    </div>
                </div>
                
                <h2 className='text-xl mt-4'>Sizes</h2>
                <button className='btn btn-sm btn-error w-1/6 my-4' onClick={deleteSizes}>DELETE SIZE(S)</button>
                <table className='table table-compact w-full'>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" onChange={handleCheckAll} />
                                </label>
                            </th>
                            <th>Id</th>
                            <th>Size Value</th>
                            <th>Created</th>
                            <th>Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sizes.map((size, i) => (
                                <tr key={i}>
                                    <td>
                                        <label>
                                            <input id={size.id} type="checkbox" className="checkbox" onChange={handleChecked} checked={sizeChecked[size.id]}/>
                                        </label>
                                    </td>
                                    <td>{size.id}</td>
                                    <td>{size.sizeValue}</td>
                                    <td>{formateDate(size.createdAt)}</td>
                                    <td>{formateDate(size.modifiedAt)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default CreateSizePage;