import axios from 'axios'
import React, { useState, useEffect } from 'react'
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
        axios.get(`https://izzys-inventory-manager.herokuapp.com/api/product/types`)
            .then(res => res.data)
            .then(data => setTypes(data))
            .catch(err => console.error(err))
    }, [])

    const handleFormChange = (event) => {
        const { value, name } = event.target
        setForm({
            ...form,
            [name]: value
        })
        console.log(form)
    }

    return (
        <Layout>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Name</span>
                </label> 
                <input type="text" name="name" class="input input-bordered" value={form.name} onChange={handleFormChange}/>
                <label class="label">
                    <span class="label-text">ImgUrl</span>
                </label> 
                <input type="text" name="imgUrl" class="input input-bordered" value={form.imgUrl} onChange={handleFormChange}/>
                <label class="label">
                    <span class="label-text">Price</span>
                </label> 
                <input type="number" name="price" class="input input-bordered" value={form.price} onChange={handleFormChange}/>
                <label class="label">
                    <span class="label-text">Quantity</span>
                </label> 
                <input type="number" name="quantity" class="input input-bordered" value={form.quantity} onChange={handleFormChange}/>
                <label class="label">
                    <span class="label-text">Type</span>
                </label> 
                <select className='select select-bordered w-full' value={form.type} name='type' onChange={handleFormChange}>
                        <option name='type' value=''>-</option>
                        {
                            types.map((t, i) => <option key={i} name='type' value={t}>{t}</option>)
                        }
                </select>
                <label class="label">
                    <span class="label-text">Sale</span>
                </label> 
                <input type="number" name="sale" class="input input-bordered" value={form.sale} onChange={handleFormChange}/>
            </div>
        </Layout>
    )
}

export default CreateProduct