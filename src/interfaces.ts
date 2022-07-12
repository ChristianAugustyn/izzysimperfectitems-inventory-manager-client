export interface Product {
    id: string,
    name: string,
    imgUrl: string,
    price: number,
    quantity: number,
    type: string,
    sale: number,
    size: string,
    collection: string
}

export interface newProduct {
    name: string,
    imgUrl: string,
    price: number,
    quantity: number,
    type: string,
    sale: number,
    size: string
}

//API V2 INTERFACES

export interface Size {
    id: string,
    sizeValue: string,
    createdAt: string,
    modifiedAt: string
}

export interface ProductV2 {
    id: string,
    name: string,
    description: string,
    categoryId: string,
    active: boolean,
    createdAt: string,
    modifiedAt: string
}

export interface Category {
    id: string,
    name: string,
    description: string,
    active: boolean,
    createdAt: string,
    modifiedAt: string
}

export interface ProductVariation {
    id: string,
    productId: string,
    sizeId: string | null,
    discountId: string | null,
    quantity: number,
    price: number,
    displayOrder: number,
    size: Size | null
}

export interface ProductImage {
    id: string,
    productId: string,
    imgUrl: string,
    displayOrder: number,
    createdAt: string,
    modifiedAt: string
}

export interface ProductInfo extends ProductV2 {
    catgeory: Category,
    variations: ProductVariation[],
    images: ProductImage[]
}

export interface S3Object {
    eTag: string,
    bucketName: string,
    key: string,
    lastModified: string
}