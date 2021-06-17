// Form page

import {useState, useEffect} from "react";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

export default function Form() {
	const [itemInputs, setItemInputs] = useState(<div>Loading... Please wait!</div>);

	// Fetch the inputs
	function fetchInputs() {
		get("/get_items") // Example output: [{"name": "Sword", "cost": 2, "max": 5}, {"name": "Pickaxe", "cost": 3, "max": 5}]
			.then((resp) => {
				setItemInputs(convertToInputs(resp.data.data));
			})
			.catch((resp) => {
				setItemInputs(<div>An error as occurred!</div>);
			});
	}

	// Convert the JSON data to input tags
	function convertToInputs(data) {
		return data.map((item) => (
			<label key={item.name} className="">
				{item.name}
				<br />
				<input
					type="number"
					name={item.name}
					min={0}
					max={item.max}
					minLength={1}
					defaultValue="0"
					className="text-center outline-none ring-0 ring-blue-600 focus:ring-4"
					required
				/>
				<br />
			</label>
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
				<div className="w-1/2 mx-auto font-bold text-center">
					<p>Form</p>
					<div className="my-2 font-normal bg-gray-200">
						<p>Select what you would like.</p>
						{itemInputs}
					</div>
				</div>
			</BaseWidget>
		</MainWidget>
	);
}
