import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from '@reach/router';
import ProductCard from './ProductCard';

const ProductsGrid = ({products}) => {

    return (
            <div className='container mx-auto flex flex-wrap'>
                {
                    products.length > 0 ? products.map((p, i) => {
                        return <ProductCard key={i} product={p}/>
                    })
                    :
                    ''
                }
            </div>
    )
}

export default ProductsGrid