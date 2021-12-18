import React, {useState, useEffect} from 'react'
import axios from 'axios'
import convertLayerAtRulesToControlComments from 'tailwindcss/lib/lib/convertLayerAtRulesToControlComments';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductsGrid = () => {
    const { collection } = useParams()

    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([])
        axios.get(`http://localhost:5000/api/product/${collection}`)
            .then(res => {
                console.log(collection)
                return res.data
            }).then(data =>{
                console.log("GOT PRODUCT")
                console.log(data)
                setProducts(data)
            }).catch(err => {
                console.error(err)
                console.log("didnt get product")
            })

    }, [collection])

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