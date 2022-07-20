import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Category } from '../interfaces';
import Layout from './Layout';

const CreateProductPage: FC<RouteComponentProps> = () => {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/categories`)
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    
    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {

    }

    return (
        <Layout>
            <div className='container mx-auto flex flex-col relative w-full h-full p-4'>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" />
                </div>
                <div className='form-control'>
                    <label className='label'><span className='label-text'>Category</span></label>
                    <select id='category' className="select select-bordered w-full" onChange={handleCategoryChange}>
                        {
                            categories.map(c => {
                                return <option id={c.name} value={c.name}>{c.name}</option>
                            })
                        }
                    </select>
                </div>
                <div className='form-control'>
                    <label className='label'><span className='label-text'>Active?</span></label>
                    <input id='active' type="checkbox" className="toggle toggle-accent toggle-lg"/>
                </div>
            </div>
        </Layout>
    );
}

export default CreateProductPage;