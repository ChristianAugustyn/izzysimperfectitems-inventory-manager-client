import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef, FC, ChangeEvent, SyntheticEvent, useLayoutEffect } from "react";
import noImage from "../images/product_placeholder.png";
import axios, { AxiosRequestConfig } from 'axios'
import { Product } from "../interfaces";

interface Props {
	product: Product,
	handleProductChange: (product: Product) => void,
	children: any
}

const ProductForm: FC<Props> = ({ children, product, handleProductChange }) => {
	//creates a DOM refference the hidden input field
	const hiddenInput = useRef<HTMLInputElement>(null)

	const [isOpen, setIsOpen] = useState(false);
	const [fields, setFields] = useState<Product>(product);
	const [file, setFile] = useState<File>()

	useEffect(() => {
		setFields(product);
	}, [product]);

	useLayoutEffect(() => {

	})

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const changeFields = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = event.target;
		setFields({
			...fields,
			[name]: type === 'number' ? parseFloat(value) : value,
		});
	};

	const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.src = noImage;
	};

	const handleFileClick = () => {
		//when the user clicks the change image button, it clicks hidden input
		if (hiddenInput.current !== null){
			hiddenInput.current.click()
		}
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		//updates the state of the file uploaded
		if (event.target.files !== null){
			const fileUploaded = event.target.files[0]
			setFile(fileUploaded)
		}
	}

	const handleUpdate = () => {
		const config: AxiosRequestConfig = {
			method: 'post',
			url: `https://izzys-inventory-manager.herokuapp.com/api/product/${fields.collection}/${fields.id}`,
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(fields)
		}

		axios(config)
			.then(res => {
				handleProductChange(fields)
			})
			.catch(err => console.error(err))
		closeModal()
	}

	const checkFields = (k: string, v: any): boolean => {
		if (hasKey(product, k)){
			return v != product[k]
		}

		return false
	}

	function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
		return key in obj
	}

	return (
		<>
			<div onClick={openModal}>{children}</div>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 z-20 overflow-y-auto"
					onClose={closeModal}
				>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0" />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<span
							className="inline-block h-screen align-middle bg-black opacity-25"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div className="inline-block w-full max-w-2xl max-w-6xl p-6 my-8 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<div className="flex flex-row-reverse md:hidden" onClick={closeModal}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-10 w-10 cursor-pointer transition ease-in-out delay 150 rounded-lg hover:bg-red-200 duration-300"
										fill="red"
										viewBox="0 0 24 24"
										stroke="red"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</div>
								<div className="flex flex-col md:flex-row">
									<div className="w-full items-center md:w-1/3 md:mx-3 md:h-full">
										<img
											className="rounded-md"
											src={fields.imgUrl}
											onError={handleImageError}
										/>
										<div className="mt-3 flex flex-col">
											<button className="btn btn-sm" onClick={handleFileClick}>
												Change Image
											</button>
											<input type='file' className="hidden" ref={hiddenInput} onChange={handleFileChange}/>
											<div className="hidden md:flex flex-col my-4">
												<button className="btn btn-success my-1" onClick={() => handleUpdate()}>Update</button>
												<button className="btn btn-error btn-outline btn-xs my-1">
													Delete
												</button>
											</div>
										</div>
									</div>
									<div className="md:w-2/3 md:m-auto">
										<table className="table table-compact w-full">
											<thead>
												<tr>
													<th>Key</th>
													<th>Value</th>
												</tr>
											</thead>
											<tbody>
												{Object.entries(fields).map(([k, v], i) => {
													return (
														<tr key={i}>
															<th>{k}</th>
															<td>
																<div className="form-control">
																	<input
																		disabled={k === "id" || k === "type" || k === "collection"}
																		name={k}
																		type={k === 'price' || k === 'quantity' || k === 'sale' ? 'number' : 'text'}
																		className={`input input-bordered ${checkFields(k, v) ? "input-warning" : ""}`}
																		value={v}
																		onChange={changeFields}
																	/>
																</div>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
										<div className="flex md:hidden flex-col my-4">
											<button className="btn btn-success my-1" onClick={() => handleUpdate()}>Update</button>
											<button className="btn btn-error btn-outline btn-xs my-1">
												Delete
											</button>
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

export default ProductForm
