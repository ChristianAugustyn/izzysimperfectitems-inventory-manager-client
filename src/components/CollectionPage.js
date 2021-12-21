import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { useParams } from '@reach/router'
import Layout from './Layout'
import ProductsGrid from './ProductsGrid'
import { validateToken } from './Auth'
import { navigate } from '@reach/router'

const CollectionPage = () => {
    const {collection} = useParams()
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/product/${collection}`)
        .then(res => res.data)
        .then(data => setProducts(data))
        .catch(err => console.error(err))
    }, [])

    return (
        <Layout>
            <div>{collection}</div>
            <ProductsGrid/>
        </Layout>
    )
}
export default CollectionPage