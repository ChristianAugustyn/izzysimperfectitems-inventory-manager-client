import axios from 'axios'
import React, { FC, SyntheticEvent, useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import noImage from '../images/product_placeholder.png'
import { Product } from '../interfaces'

interface Props {
    product: Product
}

const ProductCard: FC<Props> = ({product}) => {
    const [productInternal, setProductInternal] = useState(product)
    const { id, name, imgUrl, price, quantity, type, sale, size } = productInternal

    useEffect(() => {
        setProductInternal(product)
    },[product])

    const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = noImage
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