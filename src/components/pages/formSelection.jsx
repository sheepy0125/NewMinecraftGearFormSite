// Form selection page

import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
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

	const [itemInputs, setItemInputs] = useState(null);
	const [orderNumberDictionary, setOrderNumberDictionary] = useState({});
	const [itemPrices, setItemPrices] = useState({});
	const [totalPrice, setTotalPrice] = useState(0);

	function fetchInputs() {
		get("api/get-select-dictionary") // Example output: [{"name": "Sword", "cost": 2, "max": 5}, {"name": "Pickaxe", "cost": 3, "max": 5}]
			.then((resp) => {
				if (!resp.data.worked) throw Error(`Failed to get item selection dictionary (${resp.data.message}, code ${resp.data.code})`);
				setItemInputs(convertToInputs(resp.data.data));
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
			total += itemCost;
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
		const dictionaryValue = value !== 0 ? value : undefined; // Set it to be undefined if the value is 0 (same as `delete`)

		setOrderNumberDictionary((prevDict) => ({
			...prevDict,
			[event.target.name]: dictionaryValue,
		}));

		let itemCost = Number(event.target.getAttribute("cost")) || 0;
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
					defaultValue="0"
					onWheel={(event) => event.target.blur()}
					onChange={numberChanged}
					cost={item.cost}
					className="w-full text-center rounded-sm outline-none ring-0 ring-blue-600 focus:ring-2"
					required
				/>
			</div>
		));
	}

	function goToNextPage() {
		props.nextPage({orderNumberDictionary: orderNumberDictionary, totalPrice: totalPrice});
	}

	useEffect(() => {
		fetchInputs();
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Select what you would like to order here.</p>
				{itemInputs ? (
					<BaseWidget className="bg-blue-400">
						<TotalCost totalPrice={totalPrice} />
						<FormWidget>{itemInputs}</FormWidget>
						<TotalCost totalPrice={totalPrice} />
						<br />
						<span onClick={goToNextPage}>
							<Button>Next page</Button>
						</span>
					</BaseWidget>
				) : (
					<LoadingWidget />
				)}
			</BaseWidget>
		</MainWidget>
	);
}
