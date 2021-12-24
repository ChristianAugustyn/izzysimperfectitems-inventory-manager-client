import React, {useState, useEffect, FC} from 'react'
import axios from 'axios'
import { useParams } from '@reach/router';
import ProductCard from './ProductCard';
import { Product } from '../interfaces';

interface Props {
    products: Product[]
}

const ProductsGrid: FC<Props> = ({products}) => {

    const [productsInternal, setProdctsInternal] = useState(products)

    useEffect(() => {
        console.log(`product change`)
        setProdctsInternal([])
        setProdctsInternal(products)
    }, [products])

    return (
            <div className='container mx-auto flex flex-wrap'>
                {
                    productsInternal.length > 0 ? productsInternal.map((p, i) => {
                        return <ProductCard key={i} product={p}/>
                    })
                    :
                    ''
                }
            </div>
    )
}

export default ProductsGrid