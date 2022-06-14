import axios, { AxiosResponse } from 'axios'
import React, {useState, useEffect, FC} from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import Layout from './Layout'
import ProductsGrid from './ProductsGrid'
import { validateToken } from './Auth'
import { navigate } from '@reach/router'
import { Category, ProductInfo } from '../interfaces'

const ProductPage: FC<RouteComponentProps> = () => {
    const params = useParams();
    const { productId } = params;

    const [product, setProduct] = useState<ProductInfo>();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/categories`)
            .then((res: AxiosResponse) => res.data)
            .then((data: Category[]) => setCategories(data))
            .catch(err => console.error(err)); 

        axios.get(`http://localhost:5000/api/v2/products/${productId}`)
            .then((res: AxiosResponse) => res.data)
            .then((data: ProductInfo) => setProduct(data))
            .catch(err => {
                setProduct(undefined);
                console.error(err)
            });
    }, []);



    return (
        <Layout>
            { !!product &&
                <div>
                    <div className='form-control w-full max-w-xs'>
                        <label className='label'><span className='label-text'>Product Id</span></label>
                        <input type="text" placeholder="Id" className="input input-bordered w-full max-w-xs" value={product.id} disabled/>
                    </div>
                    <div className='form-control w-full max-w-xs'>
                        <label className='label'><span className='label-text'>Name</span></label>
                        <input type="text" placeholder="Id" className="input input-bordered w-full max-w-xs" value={product.name} />
                    </div>
                    <div className='form-control w-full max-w-xs'>
                        <label className='label'><span className='label-text'>Description</span></label>
                        <textarea className="textarea input input-bordered w-full max-w-xs" value={product.description} />
                    </div>
                    <div className='form-control w-full max-w-xs'>
                        <label className='label'><span className='label-text'>Active?</span></label>
                        <input type="checkbox" className="toggle toggle-accent toggle-lg max-w-xs" checked={product.active}/>
                    </div>
                    <div className='form-control w-full max-w-xs'>
                        <label className='label'><span className='label-text'>Category</span></label>
                        <select className="select select-bordered w-full max-w-xs">
                            <option></option>
                            {
                                categories.map(c => {
                                    return <option id={c.id} selected={c.id === product.categoryId}>{c.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            }
        </Layout>
    )
}

export default ProductPage;