// Calculator page

import {useState, useEffect} from "react";
import {useLocation, useHistory, Link} from "react-router-dom";
import {parse} from "query-string";
import {get} from "axios";
import {error} from "./errors/apiError";

import BoxWidget from "../boilerplate/widgets/boxWidget";
import BaseWidget from "../boilerplate/widgets/baseWidget";
import LoadingWidget from "../boilerplate/widgets/loadingWidget";
import FormWidget from "../boilerplate/widgets/formWidget";
import Button from "../boilerplate/button";

function TotalCost(props) {
	// Will return the total cost after adding up all the checked items
	let totalPrice = 10;

	// Map item information list to a dictionary containing the item name and
	// price
	const itemCost = props.itemInfoList.reduce((index, itemInfo) => {
		index[itemInfo.name] = itemInfo.cost;
		return index;
	}, {});

	// Add up the total cost of all the checked items
	for (const item of props.uncheckedItems) {
		totalPrice += itemCost[item];
	}

	return (
		<p className="text-center">
			Total cost: {Math.floor(totalPrice / 64)} stacks {totalPrice % 64} diamonds.
		</p>
	);
}

function ItemCheckboxWidget(props) {
	const shouldBeDisabled = getShouldBeDisabled();

	const [checked, setChecked] = useState(shouldBeDisabled);

	function getShouldBeDisabled() {
		// If the item cost is 0, it means that the item mst be provided
		// In this case, the item cannot be unchecked
		if (props.itemCost === 0) {
			return true;
		}
		return false;
	}

	useEffect(() => {
		// If the item is disabled, tell the parent to add the item
		props.handleChange(props.itemName, true);
	}, []);

	function handleChange(event) {
		if (shouldBeDisabled) return;
		setChecked(event.target.checked);
		props.handleChange(props.itemName, checked);
	}

	return (
		<div className="flex-col p-0 m-0">
			<label className="flex flex-row items-center">
				<input type="checkbox" checked={checked} disabled={shouldBeDisabled} onChange={handleChange} />
				<span className="ml-2">{props.itemRealName}</span>
			</label>
		</div>
	);
}

export default function Calculator(props) {
	const history = useHistory();

	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	const [itemInformation, setItemInformation] = useState(null);
	const [orderContentItems, setOrderContentItems] = useState([]); // Will be a list of item names (including numbers!)
	const [itemsHave, setItemsHave] = useState([]);
	const [itemsNotHave, setItemsNotHave] = useState([]);

	function fetchInputs() {
		get("api/get-select-dictionary") // Example output: [{"name": "Sword", "cost": 2, "max": 5}, {"name": "Pickaxe", "cost": 3, "max": 5}]
			.then((resp) => {
				if (!resp.data.worked) throw Error(`Failed to get item selection dictionary (${resp.data.message}, code ${resp.data.code})`);
				setItemInformation(resp.data.data);
			})
			.catch((resp) => {
				error(resp);
				history.push("/api-error");
			});
	}

	function fetchOrderItems() {
		get(`api/get-order-content?id=${paramsDictionary.id}`)
			.then((resp) => {
				if (!resp.data.worked) throw Error(`Failed fetching order content (${resp.data.message}, code ${resp.data.code})`);
				setOrderContentItems(convertOrderContent(Object.keys(resp.data.data.content)));
			})
			.catch((resp) => {
				error(resp);
				history.push("/api-error");
			});
	}

	function removeItem(itemName, array) {
		// Removes an item from an array. Will only remove the first item
		// that matches the item name
		const index = array.indexOf(itemName);
		if (index === -1) return array;
		return [...array.slice(0, index), ...array.slice(index + 1)];
	}

	function convertOrderContent(orderContentKeys) {
		const convertedOrderContent = [];

		for (const item of orderContentKeys) {
			const itemInfo = {};

			// Strip number (space and then 1-digit number)
			// const itemNameStripped = item.replace(" " + item.split(" ").at(-1), "");
			const itemNameStripped = item.slice(0, -2);

			itemInfo.name = itemNameStripped;
			itemInfo.realName = item;
			itemInfo.cost = itemInformation.filter((itemInfoFilter) => itemInfoFilter.name === itemNameStripped)[0].cost;

			convertedOrderContent.push(itemInfo);
		}

		return convertedOrderContent;
	}

	function handleChange(itemName, checked) {
		// Handles the change of an item checkbox
		// (determining whether the item is there or not)

		if (!checked) {
			// Add item
			setItemsHave([...itemsHave, itemName]);
			setItemsNotHave(removeItem(itemName, itemsNotHave));
			return;
		}
		// Remove item
		// setItemsHave(itemsHave.filter((item) => item !== itemName));
		setItemsHave(removeItem(itemName, itemsHave));
		setItemsNotHave([...itemsNotHave, itemName]);
	}

	// We need to wait for the inputs to appear before we are able to update the order content
	useEffect(() => {
		if (!itemInformation) return;
		fetchOrderItems();
	}, [itemInformation]);

	useEffect(() => {
		fetchInputs(); // See above useEffect
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	useEffect(() => {
		setItemsNotHave(orderContentItems.map((item) => item.name));
	}, [orderContentItems]);

	return (
		<BoxWidget className="mx-auto lg:mx-auto">
			<BaseWidget className="bg-blue-400">
				<p className="text-center">Welcome to the calculator!</p>
				<p className="font-normal max-w-800">
					The calculator will let you see how many diamonds you have to pay while taking into account the current gear you have.
				</p>
			</BaseWidget>

			<BaseWidget className="bg-blue-400">
				<p className="text-center">Select what you have</p>
				{itemInformation ? (
					<FormWidget className="sm:grid-cols-2">
						{Object.values(orderContentItems).map((itemInfo, itemIndex) => (
							<>
								<ItemCheckboxWidget
									key={itemIndex}
									itemName={itemInfo.name} // Only the item name
									itemRealName={itemInfo.realName} // Will include number
									itemInfo={itemInfo}
									itemCost={itemInfo.cost}
									handleChange={handleChange}
								/>
							</>
						))}
					</FormWidget>
				) : (
					<LoadingWidget />
				)}
			</BaseWidget>

			{itemInformation && (
				<BaseWidget className="bg-blue-400">
					<TotalCost itemInfoList={itemInformation} uncheckedItems={itemsNotHave} />
				</BaseWidget>
			)}

			<div className="w-full">
				<Link to="/home" className="block mx-auto w-max">
					<Button>Return home</Button>
				</Link>
				<div onClick={history.goBack} className="block mx-auto w-max ">
					<Button>Back</Button>
				</div>
			</div>
		</BoxWidget>
	);
}
