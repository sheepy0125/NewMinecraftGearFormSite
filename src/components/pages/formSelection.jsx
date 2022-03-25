// Form selection page

import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {get} from "axios";

import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Button from "../boilerplate/button.jsx";
import {error} from "./errors/apiError.jsx";

function TotalCost(props) {
	return (
		<p>
			Estimated cost: {Math.floor(props.totalPrice / 64)} stacks {props.totalPrice % 64} diamonds.
		</p>
	);
}

export default function FormSelection(props) {
	const history = useHistory();

	const [itemDictionary, setItemDictionary] = useState(null);
	const [itemInputs, setItemInputs] = useState(null);
	const [orderNumberDictionary, setOrderNumberDictionary] = useState(props.saveData.current.selectPage.orderNumberDictionary);
	const [itemPrices, setItemPrices] = useState({});
	const [totalPrice, setTotalPrice] = useState(10);

	function fetchInputs() {
		get("api/get-select-dictionary") // Example output: [{"name": "Sword", "cost": 2, "max": 5}, {"name": "Pickaxe", "cost": 3, "max": 5}]
			.then((resp) => {
				if (!resp.data.worked) throw Error(`Failed to get item selection dictionary (${resp.data.message}, code ${resp.data.code})`);
				setItemDictionary(resp.data.data);
			})
			.catch((resp) => {
				error(resp);
				history.push("/api-error");
			});
	}

	function getNewPrice({itemName, itemCount, itemCost}) {
		const cost = Number(itemCount) * Number(itemCost);
		setItemPrices((prevItemPrices) => ({
			...prevItemPrices,
			[itemName]: cost,
		}));
	}

	// Item prices changed
	useEffect(() => {
		let total = 10;

		for (const itemCost of Object.values(itemPrices)) {
			console.log({itemCost});
			total += itemCost || 0;
		}

		setTotalPrice(total);
	}, [itemPrices]);

	function numberChanged(event) {
		// Check to make sure it is valid

		if (Number(event.target.value) > Number(event.target.max)) {
			event.target.value = event.target.max;
		} else if (event.target.value <= 0) {
			event.target.value = 0;
		}

		const value = Number(event.target.value);

		// if (value !== 0) {
		// setOrderNumberDictionary((prevDict) => ({
		// ...prevDict,
		// [event.target.name]: value,
		// }));
		// } else {
		// setOrderNumberDictionary((prevDict) => {
		// const newDict = {...prevDict};
		// delete newDict[event.target.name];
		// return newDict;
		// });
		// }

		setOrderNumberDictionary((prevDict) => ({
			...prevDict,
			[event.target.name]: value === 0 ? undefined : value,
		}));

		let itemCost = Number(itemDictionary.find((item) => item.name === event.target.name).cost) || 0;
		getNewPrice({itemName: event.target.name, itemCount: Number(event.target.value), itemCost: itemCost});
	}

	function convertToInputs(data) {
		return data.map((item) => (
			<div className="block w-full px-8 py-4 text-center bg-blue-300 rounded-lg" key={item.name}>
				<p>{item.name}</p>
				<p className="font-medium">
					{item.cost > 0 ? (
						<span>
							This costs {item.cost} diamond{item.cost !== 1 ? "s" : ""} if not provided.
						</span>
					) : (
						<span>You must provide this.</span>
					)}
				</p>
				<input
					type="number"
					name={item.name}
					min={0}
					max={item.max}
					minLength={1}
					defaultValue={
						// This is stupid. We cannot use the [] syntax because if the value is undefined, so we need to first check if it is defined.
						(props.saveData.current.selectPage.orderNumberDictionary && props.saveData.current.selectPage.orderNumberDictionary[item.name]) ||
						0
					}
					onWheel={(event) => event.target.blur()}
					onChange={numberChanged}
					cost={item.cost}
					className="w-full text-center rounded-sm outline-none ring-0 ring-blue-600 focus:ring-2"
					required
				/>
				{console.log(props.saveData.current.selectPage.orderNumberDictionary) &&
					console.log(props.saveData.current.selectPage.orderNumberDictionary[item.name])}
			</div>
		));
	}

	function save() {
		const data = {orderNumberDictionary: orderNumberDictionary, totalPrice: totalPrice};
		props.saveData.current.selectPage = data;
	}

	useEffect(() => {
		fetchInputs();
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	useEffect(() => {
		if (!itemDictionary) return;

		setItemInputs(convertToInputs(itemDictionary));

		// If we are loading from a saved state, we need to update the price accordingly
		if (!props.saveData.current.selectPage) return;

		console.log({itemDictionary});

		for (const itemName of Object.keys(props.saveData.current.selectPage.orderNumberDictionary || {})) {
			const itemCount = props.saveData.current.selectPage.orderNumberDictionary[itemName];
			const itemCost = itemDictionary.find((item) => item.name === itemName).cost;
			getNewPrice({itemName: itemName, itemCount: itemCount, itemCost: itemCost});
		}
	}, [itemDictionary]);

	console.log(props.saveData.current);

	return (
		<BaseWidget className="text-xl text-center">
			<p className="font-semibold">Form</p>
			<p className="font-thin">Select what you would like to order here.</p>
			{props.saveData.current.enchantPage && (
				<p className="max-w-lg mx-auto text-sm font-thin">
					It seems you've already been here before.
					<br />
					<br />
					When changing the amount of items you have, please note that lowering the count of an item will result in deleting the item from the
					order (last-to-first).
				</p>
			)}
			{itemInputs ? (
				<BaseWidget className="bg-blue-400">
					<TotalCost totalPrice={totalPrice} />
					<FormWidget>{itemInputs}</FormWidget>
					<TotalCost totalPrice={totalPrice} />
					<br />
					<span
						onClick={() => {
							save();
							props.nextPage();
						}}
					>
						<Button>Next page</Button>
					</span>
				</BaseWidget>
			) : (
				<LoadingWidget />
			)}
		</BaseWidget>
	);
}
