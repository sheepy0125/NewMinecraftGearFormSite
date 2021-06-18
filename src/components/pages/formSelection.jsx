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
			<fieldset key={item.name} className="p-4 border-2 border-blue-400 rounded-md w-max">
				<legend className="block mx-auto border-2 ">{item.name}</legend>
				<input
					type="number"
					name={item.name}
					min={0}
					max={item.max}
					minLength={1}
					defaultValue="0"
					className="text-center rounded-sm outline-none ring-0 ring-blue-600 focus:ring-2"
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
				<div className="block mx-auto font-bold text-center">
					<p>Form</p>
					<div className="px-4 mx-auto my-2 font-normal bg-gray-200 rounded-lg w-max">
						<p>Select what you would like.</p>
						<div className="grid-cols-2 gap-4 mx-auto w-max lg:grid-cols-3 md:grid">{itemInputs}</div>
					</div>
				</div>
			</BaseWidget>
		</MainWidget>
	);
}
