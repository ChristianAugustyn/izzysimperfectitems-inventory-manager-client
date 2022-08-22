import { Link } from '@reach/router';
import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { ProductImage } from '../interfaces';

interface Props {
    checkedImages: ProductImage[],
    onChange: Function
}

export interface CheckedImages {
    [id: string]:  boolean
}

const ImagePicker: FC<Props> = ({ checkedImages, onChange }) => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [checked, setChecked] = useState<CheckedImages>({});

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/images`)
            .then((res: AxiosResponse) => {
                let images: ProductImage[] = res.data;
                setImages(images);
                //SETS DICTIONARY OF IMAGES BY ID
                images.forEach((img, i) => {
                    checked[img.id] = checkedImages.findIndex(l => l.id === img.id) === -1 ? false : true;
                })
                setChecked({...checked});
            })
            .catch(err => console.error(err));
    }, []);

    const handleImageChecked = (event: ChangeEvent<HTMLInputElement>) => {
        const { id } = event.target;

        const updatedChecked = {
            ...checked,
            [id]: !checked[id]
        }
        if (!onChange(updatedChecked, images)){
            return;
        }
        setChecked(updatedChecked);
    }

    return (
        <div className='overflow-y-scroll h-96 w-full'>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox"/>
                            </label>
                        </th>
                        <th>Image</th>
                        <th>Product</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        images.map((img: ProductImage, i: number) => (
                            <tr>
                                <th>
                                    <label>
                                        <input id={img.id} type="checkbox" className="checkbox" checked={checked[img.id]} onChange={handleImageChecked}/>
                                    </label>
                                </th>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={img.imgUrl} alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                {img.productId == null ? 
                                    <td><span className='badge badge-error'>none</span></td> 
                                    :
                                    <td><a href={`/products/${img.productId}`} target='_blank'><span className='badge badge-info'>{img.productId}</span></a></td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
    );
}

export default ImagePicker;