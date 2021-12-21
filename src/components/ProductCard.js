import axios from 'axios'
import React, { useEffect, useState } from 'react'
import resolveConfig from 'tailwindcss/lib/util/resolveConfig'
import ProductForm from './ProductForm'
import noImage from '../images/product_placeholder.png'

const ProductCard = ({product}) => {
    const [productInternal, setProductInternal] = useState(product)
    const { id, name, imgUrl, price, quantity, type, sale, size } = productInternal

    useEffect(() => {
        setProductInternal(product)
    },[product])

    const handleImageError = (e) => {
        e.target.onError = null;
        e.target.src = noImage
    }

    return (
        <div className='w-1/2 lg:w-1/4 p-4'>
            <ProductForm product={product}>
                <div className='w-full h-full'>
                    <img src={imgUrl} onError={handleImageError}/>
                </div>
                <div className='"m-4 flex flex-col flex-nowrap justify-between content-center'>
                    <h2 className='text-gray-500 uppercase'>{name}</h2>
                    <p className='truncate'>{id}</p>
                </div>
            </ProductForm>
        </div>
    )
}
export default ProductCard