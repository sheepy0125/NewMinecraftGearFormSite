// Form page

import {useState, useEffect} from "react";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

export default function FormSelection() {
	const [itemInputs, setItemInputs] = useState(<div>Loading... Please wait!</div>);
	const [orderNumberDictionary, setOrderNumberDictionary] = useState({});

	// Fetch the inputs
	function fetchInputs() {
		get("/get_select_dictionary") // Example output: [{"name": "Sword", "cost": 2, "max": 5}, {"name": "Pickaxe", "cost": 3, "max": 5}]
			.then((resp) => {
				setItemInputs(convertToInputs(resp.data.data));
			})
			.catch((resp) => {
				setItemInputs(<div>An error as occurred!</div>);
			});
	}

	// On change
	function numberChanged(event) {
		// Check to make sure it is valid

		// Is it greater than the maximum amount?
		if (Number(event.target.value) > Number(event.target.max)) {
			event.target.value = event.target.max;
		}
		// Is it less than or 0?
		else if (event.target.value <= 0) {
			event.target.value = 0;
		}

		const value = Number(event.target.value);
		const dictionaryValue = value !== 0 ? value : undefined; // Set it to be undefined if the value is 0 (so it doesn't exist anymore)

		setOrderNumberDictionary((prevDict) => ({
			...prevDict,
			[event.target.name]: dictionaryValue
		}));
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
					onChange={numberChanged}
					required
					className="w-full text-center rounded-sm outline-none ring-0 ring-blue-600 focus:ring-2"
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
				<BaseWidget>
					<div className="grid-cols-2 gap-4 mx-auto lg-4 xl:grid-cols-3 md:grid">{itemInputs}</div>
				</BaseWidget>
				<BaseWidget>
					<p>Debug</p>
					<pre className="mx-auto font-thin text-left max-w-max">{JSON.stringify(orderNumberDictionary, null, 4)}</pre>
				</BaseWidget>
			</BaseWidget>
		</MainWidget>
	);
}
