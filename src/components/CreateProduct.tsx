import axios from 'axios'
import React, { useState, useEffect, ChangeEvent } from 'react'
import Layout from './Layout'

const blankForm = {
    name: "",
    imgUrl: "",
    price: 0,
    quantity: 0,
    type: "",
    sale: 0
}

const CreateProduct = () => {

    const [types, setTypes] = useState([])
    const [form, setForm] = useState(blankForm)

    useEffect(() => {
        axios.get(`http://localhost:5000/api/product/types`)
            .then(res => res.data)
            .then(data => setTypes(data))
            .catch(err => console.error(err))
    }, [])

    const handleFormChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { value, name, type } = event.target
        setForm({
            ...form,
            [name]: type === 'number' ? parseFloat(value) : value
        })
        console.log(form)
    }

    return (
        <Layout>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Name</span>
                </label> 
                <input type="text" name="name" className="input input-bordered" value={form.name} onChange={handleFormChange}/>
                <label className="label">
                    <span className="label-text">ImgUrl</span>
                </label> 
                <input type="text" name="imgUrl" className="input input-bordered" value={form.imgUrl} onChange={handleFormChange}/>
                <label className="label">
                    <span className="label-text">Price</span>
                </label> 
                <input type="number" name="price" className="input input-bordered" value={form.price} onChange={handleFormChange}/>
                <label className="label">
                    <span className="label-text">Quantity</span>
                </label> 
                <input type="number" name="quantity" className="input input-bordered" value={form.quantity} onChange={handleFormChange}/>
                <label className="label">
                    <span className="label-text">Type</span>
                </label> 
                <select className='select select-bordered w-full' value={form.type} name='type' onChange={handleFormChange}>
                        <option value=''>-</option>
                        {
                            types.map((t, i) => <option key={i} value={t}>{t}</option>)
                        }
                </select>
                <label className="label">
                    <span className="label-text">Sale</span>
                </label> 
                <input type="number" name="sale" className="input input-bordered" value={form.sale} onChange={handleFormChange}/>
            </div>
        </Layout>
    )
}

export default CreateProduct