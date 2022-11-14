import { RouteComponentProps } from '@reach/router';
import axios, { AxiosResponse } from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Discount } from '../interfaces';
import Layout from './Layout';

interface CheckedDiscount {
    [id: string]: boolean
}
const formateDate = (timeStamp: string): string => {
    return new Date(timeStamp).toLocaleString();
}
const CreateDiscounts: FC<RouteComponentProps> = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [discountChecked, setDiscountChecked] = useState({} as CheckedDiscount);

    const getDiscountsAsync = async () => {
        try {
            let res: AxiosResponse = await axios.get(`http://localhost:5000/api/v2/discounts`);

            if (res.status !== 200) {
                console.error(res.statusText);
            }

            setDiscounts(res.data);
            
            res.data.forEach((discount: Discount) => {
                discountChecked[discount.id] = false;
            });

            setDiscountChecked({...discountChecked});

        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getDiscountsAsync();
    }, []);

    const handleChange = () => {

    }

    const createNewDiscount = () => {

    }

    const deleteDiscounts = () => {

    }

    const handleCheckAll = () => {

    }

    const handleChecked = () => {

    }

    return (
        <Layout>
            <div className='container mx-auto flex flex-col flex-wrap relative w-full h-full p-4'>
                <div className='w-full'>
                    <div className='form-control w-full mb-4'>
                        <label className='label'>
                            <span className="label-text">discount Value</span>
                        </label>
                        <div className='input-group'>
                            <input id='discountValue' type="text" placeholder="Type here" className="input input-bordered w-full" onChange={handleChange}/>
                            <button className="btn btn-accent" onClick={createNewDiscount}>Create discount</button>
                        </div>
                    </div>
                </div>
                
                <h2 className='text-xl mt-4'>discounts</h2>
                <button className='btn btn-sm btn-error w-1/6 my-4' onClick={deleteDiscounts}>DELETE discount(S)</button>
                <table className='table table-compact w-full'>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" onChange={handleCheckAll} />
                                </label>
                            </th>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Discount Type</th>
                            <th>Value</th>
                            <th>Active</th>
                            <th>Created At</th>
                            <th>Modified At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            discounts.map((discount, i) => (
                                <tr key={i}>
                                    <td>
                                        <label>
                                            <input id={discount.id} type="checkbox" className="checkbox" onChange={handleChecked} checked={discountChecked[discount.id]}/>
                                        </label>
                                    </td>
                                    <td>{discount.id}</td>
                                    <td>{discount.name}</td>
                                    <td>{discount.description}</td>
                                    <td>{discount.discountType}</td>
                                    <td>{discount.value}</td>
                                    <td>{discount.active ? "Yes" : "No"}</td>
                                    <td>{formateDate(discount.createdAt)}</td>
                                    <td>{formateDate(discount.modifiedAt)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default CreateDiscounts