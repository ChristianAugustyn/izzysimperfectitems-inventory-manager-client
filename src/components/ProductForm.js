import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export default function ProductForm({ children, product}) {
	let [isOpen, setIsOpen] = useState(false);
    const [fields, setFields] = useState(product)

	useEffect(() => {
		setFields(product)
	}, [product])

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

    const changeFields = (event) => {
        const {name, value} = event.target 
        setFields({
            ...fields,
            [name]: value
        })
    }

	return (
		<>
			<div onClick={openModal}>{children}</div>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 z-10 overflow-y-auto"
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
							<div className="inline-block w-full max-w-2xl max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                               <div className='flex flex-row'>
                                    <div className='w-1/3 mx-3 h-full'>
                                        <img className=' rounded-md' src={fields.imgUrl}/>
                                        <div className='mt-3 flex flex-col'>
                                            <button className='btn btn-sm'>Change Image</button>
                                            <div className='flex flex-col my-4'>
                                                <button className='btn btn-success my-1'>Update</button>
                                                <button className='btn btn-error btn-outline btn-xs my-1'>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-2/3 m-auto">
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
                                                                        disabled={k === 'id' || k === 'type'}
                                                                        name={k}
                                                                        type="text"
                                                                        className={`input input-bordered ${v != product[k] ? 'input-warning' : ''}`}
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
