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
        axios.get(`https://izzys-inventory-manager.herokuapp.com/api/product/${collection}`)
        .then(res => res.data)
        .then(data => setProducts(data))
        .catch(err => console.error(err))
    }, [collection])

    return (
        <Layout>
            <div>{collection}</div>
            <ProductsGrid products={products}/>
        </Layout>
    )
}
export default CollectionPage