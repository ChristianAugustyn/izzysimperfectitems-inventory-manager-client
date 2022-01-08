import axios, { AxiosRequestConfig } from 'axios'
import React, { useState, useEffect, ChangeEvent, FC, useRef } from 'react'
import Layout from './Layout'
import { Dialog } from '@headlessui/react'
import { navigate } from '@reach/router'
import { newProduct, Product } from '../interfaces'
import { stringify } from 'querystring'
import { getSessionInfo } from './Auth'

const blankForm = {
    name: "",
    imgUrl: "",
    price: 0,
    quantity: 0,
    type: "",
    sale: 0,
    size: ""
}

const CreateProduct: FC = () => {

    const [types, setTypes] = useState<string[]>([])
    const [collections, setCollections] = useState<string[]>([])
    const [form, setForm] = useState(blankForm)
    const [file, setFile] = useState<File>();
    const [isOpen, setIsOpen] = useState(true)
    const hiddenInput = useRef<HTMLInputElement>(null)
    const [notifiction, setNotifiction] = useState('opacity-0')
    const [success, setSuccess] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get(`https://izzys-inventory-manager.herokuapp.com/api/product/types`)
            .then(res => res.data)
            .then(data => setTypes(data))
            .catch(err => console.error(err))
    
        axios.get(`https://izzys-inventory-manager.herokuapp.com/api/product/collections`)
            .then(res => res.data)
            .then(data => setCollections(data))
            .catch(err => console.error(err)) 
    }, [])

    const mapTypeToCollection = (type: string): string => {
        const index = types.findIndex(t => t === type)
        return collections[index]
    }

    const handleFormChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { value, name, type } = event.target
        setForm({
            ...form,
            [name]: type === 'number' ? parseFloat(value) : value
        })
    }

	const handleFileClick = () => {
		//when the user clicks the change image button, it clicks hidden input
		if (hiddenInput.current !== null){
			hiddenInput.current.click()
		}
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		//updates the state of the file uploaded
		if (event.target.files === null){
			return
		}

        const fileUploaded = event.target.files[0]
		setFile(fileUploaded)
        setForm({...form, imgUrl: URL.createObjectURL(fileUploaded)})
	}


    const handleCreate = async () => {
        let newForm: newProduct | null = null;

        if (validateForm() > 0) {
            return
        }

        if (file === undefined){
            return
        }

        const formData = new FormData()
        formData.append("image", file, file.name)
        formData.append("collection", mapTypeToCollection(form.type))
        //create new image
        const imgConfig: AxiosRequestConfig = {
            method: 'post',
            url: 'https://izzys-inventory-manager.herokuapp.com/api/bucket/objects',
            data: formData
        }

        const res = await axios(imgConfig)
            .then(res => res.data)
            .then(data => {
                newForm = {...form, imgUrl: data}
                return true
            })
            .catch(err => {
                console.error(err)
                return false
            })
            
        if (!res) {
            return
        }

        const session = getSessionInfo()

        if (session == null) {
            return
        }

        const config: AxiosRequestConfig = {
			method: 'post',
			url: `https://izzys-inventory-manager.herokuapp.com/api/product/${mapTypeToCollection(form.type)}`,
			headers: {
                'Authorization': `Bearer ${session.token}`,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(newForm)
		}
		await axios(config)
			.then(res => {
				alertNotifiction(true)
			})
			.catch(err => {
                console.error(err)
                alertNotifiction(false)
            })


    }

    const alertNotifiction = (flag: boolean) => {
        setSuccess(flag)
        setLoading(true)
        setNotifiction('opacity-100')
        setTimeout(() => {
            setNotifiction('opacity-0')
            setSuccess(null)
            setLoading(false)
        }, 3000)
    }

    const validateForm = (): number => {
        let errors: number = 0
        if (form.name == '') errors++
        if (form.price <= 0 || form.price === NaN) errors++
        if (form.quantity < 0 || form.quantity === NaN) errors++
        if (form.sale < 0 || form.sale === NaN) errors++
        if (!types.includes(form.type)) errors++

        return errors
    }

    return (
        <Layout>
            <div className="container flex mx-auto px-5 lg:px-40 form-control relative">
                <div className={`alert absolute right-0 transition-opacity ease-in-out delay-200 ${notifiction} ${success ? 'bg-green-50' : 'bg-red-50'}`}>
                {
                    success ?
                    (
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="green">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <label>Success! your product was created</label>
                        </div>
                    ) : success == false ? 
                    (
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="red">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <label>Error! something went wrong with creating the product</label>
                        </div>
                    ) : ''
                }
                </div>
                <div className='flex items-center'>
                    <div className='flex flex-col w-1/2 md:w-1/4'>
                        <input type='file' className="hidden" ref={hiddenInput} onChange={handleFileChange}/>
                        <button className="btn btn-md" onClick={handleFileClick}>
                            Image
                        </button>
                        <p className='mx-3 truncate'>{!!file ? file.name : ''}</p>
                    </div>
                    <img className='h-28 mx-3' src={form.imgUrl}/>
                </div>
                <label className="label">
                    <span className="label-text">Name</span>
                </label> 
                <input type="text" name="name" className="input input-bordered" value={form.name} onChange={handleFormChange}/>
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
                <label className="label">
                    <span className="label-text">Size</span>
                </label> 
                <input type="text" name="size" className="input input-bordered" value={form.size} onChange={handleFormChange}/>
                <div className='flex justify-between my-4'>
                    <button className={`btn btn-success w-5/12 ${loading ? 'loading' : ''}`} onClick={handleCreate}>Create</button>
                    <button className='btn btn-outline btn-error w-5/12' onClick={() => navigate('/')}>Cancel</button>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct