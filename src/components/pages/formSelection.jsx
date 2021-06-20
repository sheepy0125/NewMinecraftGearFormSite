// Form page

import {useState, useEffect} from "react";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

export default function FormSelection() {
	const [itemInputs, setItemInputs] = useState(null);
	const [orderNumberDictionary, setOrderNumberDictionary] = useState({});
	const [itemPrices, setItemPrices] = useState({});
	const [totalPrice, setTotalPrice] = useState(0);

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

	// Get new price (onChange)
	function getNewPrice({itemName, itemCount, itemCost}) {
		const cost = Number(itemCount) * Number(itemCost);
		setItemPrices((prevItemPrices) => ({
			...prevItemPrices,
			[itemName]: cost
		}));
	}
	// When itemPrices changes, update the total price.
	useEffect(() => {
		let total = 10; // Total is initially set to 10 for the flat rate.

		for (const itemCost of Object.values(itemPrices)) {
			total += itemCost;
		}

		setTotalPrice(total);
	}, [itemPrices]);

	// Total cost component
	function TotalCost() {
		return (
			<p>
				{Math.floor(totalPrice / 64)} stacks {totalPrice % 64} diamonds.
			</p>
		);
	}

	// On input change
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

		getNewPrice({itemName: event.target.name, itemCount: Number(event.target.value), itemCost: Number(event.target.getAttribute("cost"))});
	}

	// Convert the JSON data to input tags
	function convertToInputs(data) {
		return data.map((item) => (
			<fieldset key={item.name} className="p-4 border-2 border-pink-400 rounded-md">
				<legend className="px-2 py-0 mx-auto">{item.name}</legend>
				<p className="font-medium">
					This costs {item.cost} diamond{item.cost !== 1 ? "s" : ""}.
				</p>
				<input
					type="number"
					name={item.name}
					min={0}
					max={item.max}
					minLength={1}
					defaultValue="0"
					onChange={numberChanged}
					cost={item.cost}
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
				{itemInputs !== null ? (
					<BaseWidget>
						<TotalCost />
						<div className="grid-cols-2 gap-4 mx-auto lg-4 xl:grid-cols-3 md:grid">{itemInputs}</div>
						<TotalCost />
					</BaseWidget>
				) : (
					<LoadingWidget />
				)}
				<BaseWidget>
					<p>Debug</p>
					<BaseWidget>
						<p>Order number dictionary</p>
						<pre className="mx-auto font-thin text-left max-w-max">{JSON.stringify(orderNumberDictionary, null, 4)}</pre>
					</BaseWidget>
					<BaseWidget>
						<p>Item prices dictionary</p>
						<pre className="mx-auto font-thin text-left max-w-max">{JSON.stringify(itemPrices, null, 4)}</pre>
					</BaseWidget>
				</BaseWidget>
			</BaseWidget>
		</MainWidget>
	);
}
