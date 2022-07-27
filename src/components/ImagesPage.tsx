import { Link, RouteComponentProps } from '@reach/router';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Category, ProductImage, S3Object } from '../interfaces';
import Layout from './Layout';

const ImagesPage: FC<RouteComponentProps> = () => {

    const hiddenInput = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<ProductImage[]>([]);
    const [awsImages, setAwsImages] = useState<S3Object[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>('');
    const [file, setFile] = useState<File>();
    
    const AWS_S3_URL_V1 = process.env.REACT_APP_AWS_S3_URL_V1;
    const AWS_S3_URL_V2 = process.env.REACT_APP_AWS_S3_URL_V2;

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/images`)
        .then((res: AxiosResponse) => setImages(res.data))
        .catch(err => console.error(err));

        axios.get(`http://localhost:5000/api/bucket/objects`)
            .then((res: AxiosResponse) => setAwsImages(res.data))
            .catch(err => console.error(err));

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

    const handleFileClick = () => {
		//when the user clicks the change image button, it clicks hidden input
		if (hiddenInput.current !== null){
			hiddenInput.current.click()
		}
	}

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		//updates the state of the file uploaded
		if (event.target.files === null){
			return;
		}

        const fileUploaded = event.target.files[0]
		setFile(fileUploaded);
	}

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;

        setCategory(value);
    }

    const handleCreateImage = async () => {

        if (file === undefined){
            return
        }

        if (category == null || category === '') {
            return;
        }

        const formData = new FormData();
        formData.append('image', file, file.name);
        formData.append('category', category);

        const config: AxiosRequestConfig = {
            method: 'post',
            url: `http://localhost:5000/api/v2/images`,
            data: formData
        }

        const res = await axios(config)
            .then(res => true)
            .catch(err => false);
        
        if (res) {
            alert("success, reload")
        } else {
            alert("error, image not added");
        }
    }

    return (
        <Layout>
            <input type="checkbox" id="addNewImageModal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="addNewImageModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <div className='flex flex-row w-full'>
                        <input type='file' className="hidden" ref={hiddenInput} onChange={handleFileChange}/>
                        <button className="btn btn-sm" onClick={handleFileClick}>
                            Image
                        </button>
                        <p className='mx-3 truncate w-full'>{!!file ? file.name : ''}</p>
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
                    {/* <img className='h-28 mx-3' src={form.imgUrl}/> */}
                    <button className="btn btn-sm btn-success my-4 w-full" onClick={handleCreateImage}>ADD IMAGE</button>
                </div>
            </div>

            <div className='container mx-auto flex flex-wrap relative w-full h-full p-4'>
            <div className='flex flex-row space-x-4 py-4'>
                <label htmlFor="addNewImageModal" className='btn btn-sm btn-info'>ADD IMAGE</label>
                <button className='btn btn-sm btn-error'>DELETE IMAGE(S)</button>
            </div>
            {
                images.length > 0 ?
                (
                    <table className='table table-compact w-full p-4'>
                        <thead>
                            <tr>
                                <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                                </th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Product</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                images.map((image) => {
                                    let s3Object = awsImages.find((i: S3Object) => {
                                        let key = i.key.replace(' ', '+');
                                        return `${AWS_S3_URL_V1}/${key}` === image.imgUrl || `${AWS_S3_URL_V2}/${key}` === image.imgUrl;
                                    });

                                    return (
                                        <tr>
                                            <th>
                                                <label>
                                                    <input key={image.id} type="checkbox" className="checkbox"/>
                                                </label>
                                            </th>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-20 h-20">
                                                            <img src={image.imgUrl} alt="Avatar Tailwind CSS Component" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{s3Object?.key}</td>
                                            {image.productId == null ? 
                                                <td><span className='badge badge-error'>none</span></td> 
                                                :
                                                <td><Link to={`/products/${image.productId}`}><span className='badge badge-info'>{image.productId}</span></Link></td>}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                )
                :
                (
                    <div className="flex items-center justify-center h-screen w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="animate-bounce h-1/4 w-1/4" fill="none" viewBox="0 0 24 24" stroke="lightgray" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                    </div>
                )
            }
            </div>
        </Layout>
    )
}

export default ImagesPage;