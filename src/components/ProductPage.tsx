import axios, { AxiosResponse } from 'axios'
import React, {useState, useEffect, FC} from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import Layout from './Layout'
import ProductsGrid from './ProductsGrid'
import { validateToken } from './Auth'
import { navigate } from '@reach/router'
import { ProductInfo } from '../interfaces'

const ProductPage: FC<RouteComponentProps> = () => {
    const params = useParams();
    const { productId } = params;

    const [product, setProduct] = useState<ProductInfo>();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/products/${productId}`)
            .then((res: AxiosResponse) => res.data)
            .then((data: ProductInfo) => setProduct(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Layout>
            {JSON.stringify(product)}
        </Layout>
    )
}

export default ProductPage;