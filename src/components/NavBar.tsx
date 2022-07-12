import React, { useState, useEffect, FC, KeyboardEvent, ChangeEvent } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import { Link, navigate } from "@reach/router";
import { logout } from './Auth'
import { Category } from "../interfaces";

const NavBar: FC = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/v2/categories")
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

	const handleSearch = () => {
		navigate(`/?name=${search}`);
	};

	const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	const changeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setSearch(value);
	};

	const handleLogout = () => {
		logout()
		navigate("/login")
	}

	return (
		<div className="navbar mb-2 bg-red-400">
			<div className="flex-1 px-2 hidden sm:block lg:flex-none">
				<Link className="text-lg font-bold cursor-pointer text-white" to="/">
					Izzys Imperfect Items
				</Link>
			</div>
			<div className="flex justify-end flex-1 px-2">
				<div className="flex items-stretch">
					{/* <a className="btn btn-ghost rounded-btn">
                      Button
                    </a>  */}
					<div className="form-control mx-5">
						<div className="relative">
							<input
								type="text"
								placeholder="Search"
								className="w-full pr-16 input input-bordered"
								onChange={changeSearch}
								onKeyDown={handleEnter}
								value={search}
							/>
							<button
								className="absolute top-0 right-0 rounded-l-none btn btn-ghost"
								onClick={() => handleSearch()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</div>
					</div>
					<div className='btn btn-ghost rounded-btn' onClick={() => navigate('/images')}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="white">
							<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="dropdown dropdown-end">
						<div tabIndex={0} className="btn btn-ghost rounded-btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="white"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</div>

						<ul
							tabIndex={0}
							className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
						>
							{categories.map((c, i) => {
								return (
									<li key={i}>
										<Link to={`/${c.id}`}>{c.name}</Link>
									</li>
								);
							})}
							<div className="divider" />
							<li>
								<Link to="/create">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mx-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4v16m8-8H4"
										/>
									</svg>
									New Product
								</Link>
							</li>
						</ul>
					</div>
					<div className='btn btn-ghost' onClick={() => handleLogout()}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="white"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
