import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm'

const ProductCard = ({product}) => {
    const [productInternal, setProductInternal] = useState(product)
    const { id, name, imgUrl, price, quantity, type, sale, size } = productInternal

    useEffect(() => {
        setProductInternal(product)
    },[product])

    return (
        <div className='w-1/2 lg:w-1/4 p-4'>
            <ProductForm product={product}>
                <div className='w-full h-full'>
                    <img src={imgUrl}/>
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