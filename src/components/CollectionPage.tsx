import axios from 'axios'
import React, {useState, useEffect, FC} from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import Layout from './Layout'
import ProductsGrid from './ProductsGrid'
import { validateToken } from './Auth'
import { navigate } from '@reach/router'

const CollectionPage: FC<RouteComponentProps> = () => {
    const params = useParams()
    const { collection } = params
    const [products, setProducts] = useState([])

    console.log(params)

    useEffect(() => {
        axios.get(`https://izzys-inventory-manager.herokuapp.com/api/product/${collection}`)
        .then(res => res.data)
        .then(data => setProducts(data))
        .catch(err => console.error(err))
    }, [collection, products])

    return (
        <Layout>
            <div>{collection}</div>
            <ProductsGrid products={products}/>
        </Layout>
    )
}
export default CollectionPage