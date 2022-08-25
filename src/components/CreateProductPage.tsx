import { RouteComponentProps } from '@reach/router';
import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Category, ProductImage, ProductV2 } from '../interfaces';
import ImagePicker, { CheckedImages } from './ImagePicker';
import Layout from './Layout';

const CreateProductPage: FC<RouteComponentProps> = () => {
    const [checked, setChecked] = useState<CheckedImages>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [newProduct, setNewProduct] = useState<ProductV2>({
        active: true
    } as ProductV2);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/categories`)
            .then((res) => {
                return setCategories(res.data);;
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    
    const handleProductInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type } = event.target;

        let newValue: string | boolean = value;
        if (type === "checkbox") {
            newValue = !newProduct.active;
        }

        setNewProduct({...newProduct, [id]: newValue});
    }

    const handleCreateNewProduct = async () => {
        try {
            let res: AxiosResponse = await axios.post(`http://localhost:5000/api/v2/products`, newProduct);
            
            if (res.status !== 200) {
                alert("Error: failed to save the product");
            }
            alert("Success, product has been created");

            let productId = res.data.id;
            let images: ProductImage[] = [];
            for (let key in checked) {
                if (checked[key] === true) {
                    images.push({ id: key } as ProductImage);
                }
            }
            await handleLinkImages(images, productId);
        } catch (err) {
            console.error(err);
        }
    }

    const handleEditImages = (imageDict: CheckedImages, images: ProductImage[]): boolean => {
        setChecked(imageDict);
        return true;
    }

    const handleLinkImages = async (images: ProductImage[], productId: string) => {
        images.forEach(image => {
            image.productId = productId;
        });

        try {   
            let res: AxiosResponse = await axios.put(`http://localhost:5000/api/v2/images/productId`, images);
            if (res.status !== 200) {
                alert('Error: there was an issue linking the images to the newly created product');
                return;
            }
            alert("Success, the images have been linked");
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <Layout>
            <div className='container mx-auto flex flex-col relative w-full h-full p-4'>
                <div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input id='name' type="text" placeholder="Type here" className="input input-bordered w-full" onChange={handleProductInputChange} />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <input id='description' type="text" placeholder="Type here" className="input input-bordered w-full" onChange={handleProductInputChange} />
                    </div>
                    <div className='form-control'>
                        <label className='label'><span className='label-text'>Category</span></label>
                        <select id='categoryId' className="select select-bordered w-full" onChange={handleProductInputChange}>
                            {
                                categories.map(c => {
                                    return <option id={c.id} value={c.id}>{c.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className='form-control'>
                        <label className='label'><span className='label-text'>Active?</span></label>
                        <input id='active' type="checkbox" checked={newProduct.active} className="toggle toggle-accent toggle-lg" onChange={handleProductInputChange}/>
                    </div>
                    <button className='btn btn-accent btn-sm float-right' onClick={handleCreateNewProduct}>Create New Product</button>
                </div>
                <ImagePicker checkedImages={[]} onChange={handleEditImages}/>
            </div>
        </Layout>
    );
}

export default CreateProductPage;