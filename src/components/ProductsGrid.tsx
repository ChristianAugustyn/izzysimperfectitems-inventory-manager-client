import React, {useState, useEffect, FC} from 'react'
import axios from 'axios'
import { useParams } from '@reach/router';
import ProductCard from './ProductCard';
import { Product, ProductInfo } from '../interfaces';

// interface Props {
//     products: Product[]
// }

interface Props {
    products: ProductInfo[]
}

const ProductsGrid: FC<Props> = ({products}) => {

    const [productsInternal, setProductsInternal] = useState<ProductInfo[]>(products)

    useEffect(() => {
        setProductsInternal([])
        setProductsInternal(products)
    }, [products])

    const handleProductsChange = (product: ProductInfo) => {
        //TODO: FINISH THIS PRODUCTS MATCHER
        const index = productsInternal.findIndex(p => p.id === product.id)
        const update = productsInternal
        update[index] = product
        //react needs to see a new object in order to re-render
        setProductsInternal([...update])
    }

    const handleProductsDeleted = (product: ProductInfo) => {
        const index = productsInternal.findIndex(p => p.id === product.id)
        const update = productsInternal
        if (index > -1) {
            update.splice(index, 1)
        }
        setProductsInternal([...update])
    }

    // return (
    //         <div className='container mx-auto flex flex-wrap'>
    //             {
    //                 productsInternal.length > 0 ? productsInternal.map((p, i) => {
    //                     return <ProductCard key={i} product={p} handleProductsChange={handleProductsChange} handleProductsDeleted={handleProductsDeleted}/>
    //                 })
    //                 :
    //                 ''
    //             }
    //         </div>
    // )

    return (
        <div className='container mx-auto flex flex-wrap relative w-full h-full'>
            {
                productsInternal.length > 0 ? productsInternal.map((p, i) => {
                    return <ProductCard key={i} product={p} handleProductsChange={handleProductsChange} handleProductsDeleted={handleProductsDeleted}/>
                })
                :
                (
                    <div className="flex items-center justify-center h-screen w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="animate-bounce h-1/4 w-1/4" fill="none" viewBox="0 0 24 24" stroke="lightgray" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                    </div>
                )
            }
        </div>
    );
}

export default ProductsGrid