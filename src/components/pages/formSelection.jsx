// Form page

import {useState, useEffect} from "react";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

export default function FormSelection() {
	const [itemInputs, setItemInputs] = useState(<div>Loading... Please wait!</div>);

	// Fetch the inputs
	function fetchInputs() {
		get("/get_select_dictionary") // Example output: [{"name": "Sword", "cost": 2, "max": 5}, {"name": "Pickaxe", "cost": 3, "max": 5}]
			.then((resp) => {
				console.log(resp);
				setItemInputs(convertToInputs(resp.data.data));
			})
			.catch((resp) => {
				setItemInputs(<div>An error as occurred!</div>);
			});
	}

	// Convert the JSON data to input tags
	function convertToInputs(data) {
		return data.map((item) => (
			<fieldset key={item.name} className="p-4 border-2 border-pink-400 rounded-md">
				<legend className="px-2 mx-auto">{item.name}</legend>
				<input
					type="number"
					name={item.name}
					min={0}
					max={item.max}
					minLength={1}
					defaultValue="0"
					className="w-full text-center rounded-sm outline-none ring-0 ring-blue-600 focus:ring-2"
					required
				/>
			</fieldset>
		));
	}

	// Fetch inputs on first load
	useEffect(() => {
		fetchInputs();
	}, []); /* eslint-disable-line */ // This is stupid. [] makes it so it only runs the first time.

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Select what you would like to order here.</p>
				<BaseWidget className="w-full px-4 py-4 mx-auto bg-gray-200 lg:px-8 md:w-max" activeOpacity="60" inactiveOpacity="60">
					<div className="grid-cols-2 gap-4 mx-auto lg-4 xl:grid-cols-3 md:grid">{itemInputs}</div>
				</BaseWidget>
			</BaseWidget>
		</MainWidget>
	);
}
