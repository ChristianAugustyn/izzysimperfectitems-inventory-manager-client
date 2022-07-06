import axios from 'axios'
import React, { FC, SyntheticEvent, useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import noImage from '../images/product_placeholder.png'
import { Product, ProductInfo } from '../interfaces'
import { Link } from '@reach/router'

interface Props {
    product: ProductInfo,
    handleProductsChange: (product: ProductInfo) => void
    handleProductsDeleted: (product: ProductInfo) => void
}

const ProductCard: FC<Props> = ({product, handleProductsChange, handleProductsDeleted}) => {
    const [productInternal, setProductInternal] = useState<ProductInfo>(product)
    // const { id, name, imgUrl, price, quantity, type, sale, size } = productInternal
    const { id, name, description, categoryId, active, catgeory, variations, images } = productInternal;

    useEffect(() => {
        setProductInternal(product)
    },[product])

    const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = noImage
    }

    return (
        <div className='w-1/2 h-full lg:w-1/4 p-4'>
            {/* <ProductForm product={product} handleProductChange={handleProductChange} handleProductDeleted={handleProductDeleted}> */}
            <Link to={`/products/${id}`}>
                <div className='w-full h-full'>
                    <img src={images[0].imgUrl} onError={handleImageError} alt={images[0].id}/>
                </div>
                <div className='"m-4 flex flex-col flex-nowrap justify-between content-center'>
                    <h2 className='font-medium uppercase'>{name}</h2>
                    <p className='truncate text-gray-400'>{id}</p>
                </div>
            {/* </ProductForm> */}
            </Link>
        </div>
    )
}
export default ProductCard