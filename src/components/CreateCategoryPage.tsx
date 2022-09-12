import { RouteComponentProps } from "@reach/router";
import axios, { AxiosResponse, AxiosResponseTransformer } from "axios";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Category, Product, ProductImage } from "../interfaces";
import ImagePicker, { CheckedImages } from "./ImagePicker";
import Layout from "./Layout";


const CreateCategoryPage: FC<RouteComponentProps> = () => {
    const [newCategory, setNewCategory] = useState<Category>({
        active: true
    } as Category);

    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/categories`)
        .then((res: AxiosResponse) => {
            setCategories(res.data);
        }).catch(err => console.error(err));
    }, []);

    // const [checked, setChecked] = useState<CheckedImages>({});

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = event.target;
        
        let modifiedValue: string | number | boolean = value;

        if (type === "checkbox") {
            modifiedValue = !newCategory.active;
        }

        setNewCategory({...newCategory, [id]: modifiedValue});
    }

    const handleCreateCategory = async () => {
        try {
            let res: AxiosResponse = await axios.post(`http://localhost:5000/api/v2/categories`, newCategory);
            if (res.status === 200) {
                alert('success');
                window.location.reload();
            }
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <Layout>
            <div className='container mx-auto flex flex-wrap relative w-full h-full p-4'>
                <div className='w-full'>
                    <div className='form-control w-full'>
                        <label className='label'>
                            <span className="label-text">Name</span>
                        </label>
                        <input id='name' type="text" placeholder="Type here" className="input input-bordered w-full" onChange={handleChange} value={newCategory.name}/>
                    </div>
                    <div className='form-control w-full'>
                        <label className='label'>
                            <span className="label-text">Description</span>
                        </label>
                        <textarea id='description' placeholder="Type here" className="textarea textarea-bordered w-full" onChange={handleChange} value={newCategory.description} />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Active?</span>
                        </label>
                        <input id='active' type="checkbox" className="toggle toggle-accent" onChange={handleChange} checked={newCategory.active}/>
                    </div>
                    <button className="btn btn-sm btn-accent float-right" onClick={handleCreateCategory}>Create Category</button>
                </div>
                {/* <ImagePicker checkedImages={[]} onChange={handleEditImages}/> */}
                
                <h2 className='text-xl mt-4'>Categories</h2>
                <table className='table table-compact w-full'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map(category => (
                                <tr>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td><input type="checkbox" checked={category.active} className="checkbox" /></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default CreateCategoryPage;