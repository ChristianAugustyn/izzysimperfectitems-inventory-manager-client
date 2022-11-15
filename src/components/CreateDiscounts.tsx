import { RouteComponentProps } from '@reach/router';
import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Discount } from '../interfaces';
import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CheckedDiscount {
    [id: string]: boolean
}
const formateDate = (timeStamp: string): string => {
    return new Date(timeStamp).toLocaleString();
}
const CreateDiscounts: FC<RouteComponentProps> = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [discountChecked, setDiscountChecked] = useState({} as CheckedDiscount);
    const [newDiscount, setNewDiscount] = useState<Discount>({active: true} as Discount);

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

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = event.target;
        let newValue: any = value;
        console.log(id, value, type);
        switch (type) {
            case "checkbox":
                newValue = !newDiscount.active;
                break;
            case "number":
                newValue = parseFloat(value);
                break;
            default:
                break;
        }

        setNewDiscount({
            ...newDiscount,
            [id]: newValue
        });
        console.log(id, value, type)
    }

    const createNewDiscount = async () => {
        console.log(newDiscount);
        try {
            let res: AxiosResponse = await axios.post(`http://localhost:5000/api/v2/discounts`, newDiscount);
            console.log(res);
            if (res.status !== 200) {
                toast.error('Error, the discount could not be saved, please try again');
                return;
            }

            toast.success('Success, the discount has been created!');
            setNewDiscount({} as Discount);
            getDiscountsAsync();
        } catch (err) {
            console.error(err);
            toast.error('Error, the discount could not be saved, please try again')
        }
    }

    const deleteDiscounts = () => {

    }

    const handleCheckAll = () => {

    }

    const handleChecked = () => {

    }

    return (
        <Layout>
            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="light"
            />
            <div className='container mx-auto flex flex-col flex-wrap relative w-full h-full p-4'>
                <div className='w-full'>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input id="name" name="name" type="text" placeholder="Type here" className="input input-bordered w-full" value={newDiscount.name} onChange={handleChange}/>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea id="description" name="description" className="textarea textarea-bordered" placeholder="description" value={newDiscount.description} onChange={handleChange}/>                
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select id="discountType" className="select select-bordered w-full" onChange={handleChange}>
                            <option>None</option>
                            <option value="dollar">dollar</option>
                            <option value="percent">percent</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Value</span>
                        </label>
                        <input id="value" name="value" type="number" className="input input-bordered w-full" value={newDiscount.value} onChange={handleChange}/>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Active</span>
                        </label>
                        <input id="active" type="checkbox" className="toggle toggle-accent" checked={newDiscount.active} onChange={handleChange}/>
                    </div>
                </div>
                <button className="btn btn-success my-3" onClick={createNewDiscount}>Create Discount</button>
                <h2 className='text-xl mt-4'>discounts</h2>
                <button className='btn btn-sm btn-error w-1/6 my-4' onClick={deleteDiscounts}>DELETE DISCOUNT(S)</button>
                <table className='table table-compact'>
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