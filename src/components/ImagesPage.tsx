import { Link, RouteComponentProps } from '@reach/router';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Category, ProductImage, S3Object } from '../interfaces';
import { CheckedImages } from './ImagePicker';
import Layout from './Layout';
import FileDragAndDrop from './util/FilesDragAndDrop';

const ImagesPage: FC<RouteComponentProps> = () => {

    // const hiddenInput = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<ProductImage[]>([]);
    const [awsImages, setAwsImages] = useState<S3Object[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>('');
    const [file, setFile] = useState<File>();
    const [checked, setChecked] = useState<CheckedImages>({});
    
    const AWS_S3_URL_V1 = process.env.REACT_APP_AWS_S3_URL_V1;
    const AWS_S3_URL_V2 = process.env.REACT_APP_AWS_S3_URL_V2;

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/images`)
        .then((res: AxiosResponse) => {
            let images: ProductImage[] = res.data;
            setImages(images)
            images.forEach((img, i) => {
                checked[img.id] = false;
            })
            setChecked({...checked});
        })
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

    const handleImageChecked = (event: ChangeEvent<HTMLInputElement>) => {
        const { id } = event.target;
        const updatedChecked = {
            ...checked,
            [id]: !checked[id]
        }
        setChecked(updatedChecked);
    }

    // const handleFileClick = () => {
	// 	//when the user clicks the change image button, it clicks hidden input
	// 	if (hiddenInput.current !== null){
	// 		hiddenInput.current.click();
	// 	}
	// }

    // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	//updates the state of the file uploaded
	// 	if (event.target.files === null){
	// 		return;
	// 	}

    //     const fileUploaded = event.target.files[0]
	// 	setFile(fileUploaded);
	// }

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

    const handleDeleteImages = async () => {
        //construct queryparams
        // eslint-disable-next-line no-restricted-globals
        let isExecute = confirm("Are you sure You want to delete these images?");

        if (!isExecute) {
            return;
        }

        let imageKeys = "";
        Object.entries(checked).every(([imageId, checked]: [string, boolean]) => {
            if (checked === false) {
                return true;
            }

            let imageObject = images.find((image: ProductImage) => image.id === imageId);

            if (imageObject!.productId !== null) {
                alert("one of the images selected is linked to a product, please make sure all images are unlinked");
                return false;
            }

            if (imageObject === undefined) {
                alert(`image of id: ${imageId} could not be found`);
                return false;
            }

            let s3Object = awsImages.find((i: S3Object) => {
                let key = i.key.replace(' ', '+');
                return `${AWS_S3_URL_V1}/${key}` === imageObject!.imgUrl || `${AWS_S3_URL_V2}/${key}` === imageObject!.imgUrl;
            });

            imageKeys += `key=${s3Object?.key}|${imageId}`;

        })

        if (imageKeys === "") {
            return;
        }

        axios.delete(`http://localhost:5000/api/v2/images?${imageKeys}`)
            .then((res: AxiosResponse) => window.location.reload())
            .catch((err: AxiosError) => alert(err.message));
        
    }

    return (
        <Layout>
            <input type="checkbox" id="addNewImageModal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="addNewImageModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <div className='flex flex-col w-full'>
                        {/* <input type='file' className="hidden" ref={hiddenInput} onChange={handleFileChange}/>
                        <button className="btn btn-sm" onClick={handleFileClick}>
                            Image
                        </button> */}
                        <FileDragAndDrop message='Drag and drop product image' icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>} 
                            onFileChange={setFile}
                        />
                        <p className='mx-3 truncate w-full'>{!!file ? file.name : ''}</p>
                    </div>
                    <div className='form-control'>
                        <label className='label'><span className='label-text'>Category</span></label>
                        <select id='category' className="select select-bordered w-full" onChange={handleCategoryChange}>
                            <option id="" value=""></option>
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
                <button className='btn btn-sm btn-error' onClick={handleDeleteImages}>DELETE IMAGE(S)</button>
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
                                                    <input id={image.id} type="checkbox" className="checkbox" onChange={handleImageChecked}/>
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