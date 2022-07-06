import axios from 'axios'
import React, {useState, useEffect, FC} from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import Layout from './Layout'
import ProductsGrid from './ProductsGrid'
import { validateToken } from './Auth'
import { navigate } from '@reach/router'

const CollectionPage: FC<RouteComponentProps> = () => {
    const params = useParams()
    const { category } = params
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/products?CategoryId=${category}`)
        .then(res => res.data)
        .then(data => setProducts(data))
        .catch(err => console.error(err))
    }, [category])

    return (
        <Layout>
            <ProductsGrid products={products}/>
        </Layout>
    )
}
export default CollectionPage