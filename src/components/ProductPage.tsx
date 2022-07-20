import axios, { Axios, AxiosResponse } from 'axios'
import React, { useState, useEffect, FC, ChangeEvent } from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import Layout from './Layout'
import ProductsGrid from './ProductsGrid'
import { validateToken } from './Auth'
import { navigate } from '@reach/router'
import { Category, ProductInfo, ProductV2, ProductVariation, Size } from '../interfaces'
import { isTemplateExpression } from 'typescript'
import PopupMessage from './PopupMessage'
import ImagePicker from './ImagePicker'
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';

const ProductPage: FC<RouteComponentProps> = () => {
    const params = useParams();
    const { productId } = params;

    const [product, setProduct] = useState<ProductInfo>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [checkedVariations, setCheckedVariations] = useState<{ [key: string]: boolean }>({});
    const [newVariation, setNewVariation] = useState<ProductVariation>({} as ProductVariation);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/v2/categories`)
            .then((res: AxiosResponse) => res.data)
            .then((data: Category[]) => setCategories(data))
            .catch(err => console.error(err));

        axios.get(`http://localhost:5000/api/v2/products/${productId}`)
            .then((res: AxiosResponse) => res.data)
            .then((data: ProductInfo) => {
                setProduct(data);
                setCheckedVariations(Object.assign({}, ...data.variations.map(v => ({ [v.id]: false }))));
            })
            .catch(err => {
                setProduct(undefined);
                console.error(err)
            });
        axios.get(`http://localhost:5000/api/v2/sizes`)
            .then((res: AxiosResponse) => res.data)
            .then((data: Size[]) => setSizes(data))
            .catch(err => {
                console.log(err);
            })
    }, []);

    // EVENT HANDLERS
    const handleProductInfoChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target;
        if (product === undefined || value === undefined) {
            return;
        }

        setProduct({ ...product, [id]: value });
    }

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;

        if (product === undefined || value === undefined) {
            return;
        }

        setProduct({
            ...product,
            categoryId: value
        })
    }

    const handleProductActive = () => {
        if (product === undefined) {
            return;
        }
        setProduct({ ...product, active: !product.active });
    }

    const handleVariationSizeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        var { id, value } = event.target;
        console.log(id, value)
        //TODO: add size change
        if (product === undefined || value === undefined) { return; }

        for (const variation of product.variations) {
            if (variation.id === id) {
                variation.sizeId = value === "None" ? null : value;
                variation.size = sizes.find(s => s.id === value) || null;
                break;
            }
        }

        setProduct({ ...product });
    }

    const handleCheckAll = () => {
        setCheckAll(!checkAll);
        Object.keys(checkedVariations).forEach(id => checkedVariations[id] = !checkAll)
        setCheckedVariations({ ...checkedVariations });
    }

    const handleCheckVariation = (event: ChangeEvent<HTMLInputElement>) => {
        const { id } = event.target;
        setCheckedVariations({
            ...checkedVariations,
            [id]: !checkedVariations[id]
        })
    }

    const handleNewVariationChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        var { id, value, type } = event.target;
        setNewVariation({
            ...newVariation,
            [id]: type === 'number' ? parseFloat(value) : value
        })
    }

    const handleNewVariation = () => {
        if (product === undefined) {
            return;
        }
        //set relationship "Product-ProductVariation"
        newVariation.productId = product.id;

        axios.post(`http://localhost:5000/api/v2/products/${product.id}/variations`, newVariation)
            .then((res: AxiosResponse) => res.data)
            .then((data: ProductVariation) => {
                window.location.reload();
            })
            .catch(err => console.error(err));
    }

    const handleDeleteVariations = () => {
        var queryString: string = "";

        if (product === undefined) {
            return;
        }

        if (product.variations.length <= 1) {
            alert("a product must have at least one variation");
            return;
        }

        Object.entries(checkedVariations).forEach(([id, checked]) => {
            if (checked) {
                queryString += `id=${id}&`;
            }
        })

        if (queryString === '') {
            alert("no items where selected");
            return;
        }

        axios.delete(`http://localhost:5000/api/v2/products/${product.id}/variations?${queryString}`)
            .then((res: AxiosResponse) => window.location.reload())
            .catch(err => console.error(err));
    }

    const handleVariationChanges = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, type } = event.target;
        const property = event.target.getAttribute("data-variation-property");
        const variationId = event.target.getAttribute('data-variation-id');

        if (product === undefined || property === null) {
            return;
        }

        var parsedValue: string | number = value;

        if (type === "number") {
            parsedValue = parseFloat(value);
        }

        //find and modify variation
        var index = product.variations.findIndex(v => v.id === variationId);
        var variation: ProductVariation = product.variations[index];
        variation = {
            ...variation,
            [property]: parsedValue
        }

        //remove existing variations and add updated version
        var variations = product.variations.filter(v => v.id !== variation.id);
        variations.push(variation);

        setProduct({ ...product, variations: variations });
    }

    const handleSaveChanges = () => {
        if (product === undefined) {
            return;
        }

        axios.put(`http://localhost:5000/api/v2/products/variations`, product.variations)
            .then((res: AxiosResponse) => alert("Product Updated Successfully"))
            .catch(err => console.error(err));

        var data: ProductV2[] = [];
        data.push(product);

        axios.put(`http://localhost:5000/api/v2/products`, data)
            .then((res: AxiosResponse) => alert("Variations Updated Successfully"))
            .catch(err => console.error(err));
    }

    //DRAG AND DROP
    const reorder = (list: any[], startIndex: number, endIndex: number, middleware: Function): any[] => {
        let result = list;
        console.log(result);
        const [removed] = result.splice(startIndex, 1);
        console.log(removed);
        result.splice(endIndex, 0, removed);
        console.log(result);

        result = middleware(result);

        return result;
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        if (product === undefined) {
            return;
        }

        const items = reorder(product.variations, result.source.index, result.destination.index, (list: ProductVariation[]): ProductVariation[] => {
            list.forEach((item, i) => {
                item.displayOrder = i;
            });

            return list;
        });

        setProduct({
            ...product,
            variations: items
        });
    }

    return (
        <Layout>
            <input type="checkbox" id="editImages" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <label htmlFor="editImages" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">Link Images</h3>

                    {/* <ImagePicker/> */}

                    <div className='flex flex-row space-x-4'>
                        <div className="modal-action">
                            <label htmlFor="editImages" className="btn btn-sm btn-error">CLOSE</label>
                        </div>
                        <div className="modal-action">
                            <label htmlFor="editImages" className="btn btn-sm btn-success">SAVE</label>
                        </div>
                    </div>
                </div>
            </div>
            {!!product ?
                (<div className='container mx-auto flex'>
                    {/* images */}
                    <div className='w-1/3 p-4'>
                        <div className="carousel w-full">
                            {
                                product.images.map((image, i) => (
                                    <div id={image.id} className="carousel-item w-full">
                                        <img src={image.imgUrl} className="w-full" />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-center w-full py-2 gap-2">
                            {
                                product.images.map((image, i) => (<a href={`#${image.id}`} className="btn btn-xs">{i + 1}</a>))
                            }
                        </div>
                        <label htmlFor="editImages" className='btn btn-sm btn-secondary'>EDIT IMAGES</label>
                    </div>

                    <div className='w-2/3 p-4'>
                        {/* Product Info Row 1 */}
                        <div className='flex flex-row'>
                            <div className='form-control w-1/2 p-4'>
                                <label className='label'><span className='label-text'>Product Id</span></label>
                                <input type="text" placeholder="Id" className="input input-bordered w-full " value={product.id} disabled />
                            </div>
                            <div className='form-control w-1/2 p-4'>
                                <label className='label'><span className='label-text'>Name</span></label>
                                <input id='name' type="text" placeholder="Id" className="input input-bordered w-full " value={product.name} onChange={handleProductInfoChange} />
                            </div>
                        </div>
                        {/* Product Info Row 2 */}
                        <div className='flex flex-row'>
                            <div className='form-control w-1/2 p-4 '>
                                <label className='label'><span className='label-text'>Description</span></label>
                                <textarea id='description' className="textarea input input-bordered w-full " value={product.description} onChange={handleProductInfoChange} />
                            </div>
                            <div className='flex flex-row'>
                                <div className='form-control p-4'>
                                    <label className='label'><span className='label-text'>Category</span></label>
                                    <select id='category' className="select select-bordered w-full " onChange={handleCategoryChange}>
                                        {
                                            categories.map(c => {
                                                return <option id={c.name} selected={c.id === product.categoryId} value={c.id}>{c.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='form-control p-4'>
                                    <label className='label'><span className='label-text'>Active?</span></label>
                                    <input id='active' type="checkbox" className="toggle toggle-accent toggle-lg " checked={product.active} onChange={handleProductActive} />
                                </div>
                            </div>
                        </div>
                        <hr />
                        {/* VARIATIONS */}
                        <div className='flex flex-row p-4'>
                            <button className="btn btn-error btn-md mr-4" onClick={handleDeleteVariations}>Delete Variation(s)</button>
                            <button className="btn btn-success btn-md mr-4" onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                        <div className='overflow-x-auto w-full p-4 h-full'>
                            <table className='table w-full h-100'>
                                <tr className='border-t-2'>
                                    <th>
                                        <button className="btn btn-info btn-circle btn-outline btn-sm" onClick={handleNewVariation}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </th>
                                    <td>$<input id="price" type="number" placeholder="0.00" step='0.01' className="input input-ghost w-full" value={newVariation.price} onChange={handleNewVariationChange} /></td>
                                    <td><input id="quantity" type="number" placeholder="0" step='1' className="input input-ghost w-full" value={newVariation.quantity} onChange={handleNewVariationChange} /></td>
                                    <td><input id="discountId" type="text" placeholder="None" className="input input-ghost w-full" value={newVariation.discountId || 'None'} onChange={handleNewVariationChange} /></td>
                                    <td>
                                        <select id="sizeId" className="select select-ghost w-full" onChange={handleNewVariationChange}>
                                            <option selected>None</option>
                                            {
                                                sizes.map(s => (

                                                    <option key={s.id} value={s.id}>{s.sizeValue}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                            </table>
                            <table className='table w-full'>
                                <thead>
                                    <tr>
                                        <th>
                                            <label>
                                                <input id='checkAll' type="checkbox" className="checkbox" checked={checkAll} onChange={handleCheckAll} />
                                            </label>
                                        </th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Discount</th>
                                        <th>Size</th>
                                    </tr>
                                </thead>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable" isDropDisabled={false}>
                                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                                            <tbody ref={provided.innerRef}>
                                                {
                                                    product.variations.sort((a, b) => a.displayOrder - b.displayOrder).map((variation, i) => (
                                                        <Draggable key={variation.id} draggableId={variation.id} index={i}>
                                                            {(dragableProvided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                                <tr
                                                                    ref={dragableProvided.innerRef}
                                                                    {...dragableProvided.draggableProps}
                                                                    {...dragableProvided.dragHandleProps}
                                                                >
                                                                    <th>
                                                                        <label>
                                                                            <input id={variation.id} type="checkbox" className="checkbox" checked={checkedVariations[variation.id]} onChange={handleCheckVariation} />
                                                                        </label>
                                                                    </th>
                                                                    <td>$<input data-variation-id={variation.id} data-variation-property='price' type="number" step="0.01" placeholder="0.00" className="input input-ghost w-full" value={variation.price} onChange={handleVariationChanges} /></td>
                                                                    <td><input data-variation-id={variation.id} data-variation-property='quantity' type="number" step="1" placeholder="0" className="input input-ghost w-full" value={variation.quantity} onChange={handleVariationChanges} /></td>
                                                                    <td><input data-variation-id={variation.id} data-variation-property='discountId' type="text" placeholder="0" className="input input-ghost w-full" value={variation.discountId || "None"} onChange={handleVariationChanges} /></td>
                                                                    <td>
                                                                        <select id={variation.id} className="select select-ghost w-full" onChange={handleVariationSizeSelect}>
                                                                            <option>None</option>
                                                                            {
                                                                                sizes.map(s => (
                                                                                    <option key={s.id} selected={s.id === variation.sizeId} value={s.id}>{s.sizeValue}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                }
                                                {/* ADD NEW VARIATION SECTION */}
                                            </tbody>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </table>
                        </div>
                    </div>
                </div>
                )
                :
                (
                    <div className="flex items-center justify-center h-screen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="animate-bounce h-1/4 w-1/4" fill="none" viewBox="0 0 24 24" stroke="lightgray" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                    </div>
                )
            }
        </Layout>
    )
}

export default ProductPage;