import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import { Link, navigate } from "@reach/router";
import { logout } from './Auth'

const NavBar = () => {
	const [collections, setCollections] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios
			.get("https://izzys-inventory-manager.herokuapp.com/api/product/collections")
			.then((res) => {
				return res.data;
			})
			.then((data) => {
				setCollections(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const handleSearch = () => {
		navigate(`/?name=${search}`);
	};

	const handleEnter = (event) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	const changeSearch = (event) => {
		const { value } = event.target;
		setSearch(value);
	};

	const handleLogout = () => {
		logout()
		navigate("/login")
	}

	return (
		<div class="navbar mb-2 bg-red-400">
			<div class="flex-1 px-2 hidden sm:block lg:flex-none">
				<Link class="text-lg font-bold cursor-pointer text-white" to="/">
					Izzys Imperfect Items
				</Link>
			</div>
			<div class="flex justify-end flex-1 px-2">
				<div class="flex items-stretch">
					{/* <a class="btn btn-ghost rounded-btn">
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
					<div class="dropdown dropdown-end">
						<div tabindex="0" class="btn btn-ghost rounded-btn">
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
							tabindex="0"
							class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
						>
							{collections.map((c, i) => {
								return (
									<li key={i}>
										<Link to={`/${c}`}>{c}</Link>
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
