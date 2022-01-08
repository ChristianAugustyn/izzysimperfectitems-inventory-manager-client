import React, {useState, useEffect, FC} from 'react'
import axios from 'axios'
import { useParams } from '@reach/router';
import ProductCard from './ProductCard';
import { Product } from '../interfaces';

interface Props {
    products: Product[]
}

const ProductsGrid: FC<Props> = ({products}) => {

    const [productsInternal, setProductsInternal] = useState<Product[]>(products)

    useEffect(() => {
        setProductsInternal([])
        setProductsInternal(products)
    }, [products])

    const handleProductsChange = (product: Product) => {
        //TODO: FINISH THIS PRODUCTS MATCHER
        const index = productsInternal.findIndex(p => p.id === product.id)
        const update = productsInternal
        update[index] = product
        //react needs to see a new object in order to re-render
        setProductsInternal([...update])
    }

    const handleProductsDeleted = (product: Product) => {
        const index = productsInternal.findIndex(p => p.id === product.id)
        const update = productsInternal
        if (index > -1) {
            update.splice(index, 1)
        }
        setProductsInternal([...update])
    }

    return (
            <div className='container mx-auto flex flex-wrap'>
                {
                    productsInternal.length > 0 ? productsInternal.map((p, i) => {
                        return <ProductCard key={i} product={p} handleProductsChange={handleProductsChange} handleProductsDeleted={handleProductsDeleted}/>
                    })
                    :
                    ''
                }
            </div>
    )
}

export default ProductsGrid