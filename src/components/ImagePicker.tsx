import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { ProductImage } from '../interfaces';

const ImagePicker = () => {
    const [images, setImages] = useState<ProductImage[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/images`)
            .then((res: AxiosResponse) => setImages(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <>
        <table className="table w-full">
            <thead>
            <tr>
                <th>
                <label>
                    <input type="checkbox" className="checkbox" />
                </label>
                </th>
                <th>Name</th>
                <th>Job</th>c
                <th>Favorite Color</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {/* TODO: ADD IMAGE GRID */}
            </tbody>
        </table>
        </>
    );
}

export default ImagePicker;