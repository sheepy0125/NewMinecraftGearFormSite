// Form enchants page

import {useState, useEffect, useRef, useCallback} from "react";
import {useHistory} from "react-router-dom";
import {post} from "axios";

import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Button from "../boilerplate/button.jsx";
import renderItemInputs from "../formInputsEditing.jsx";
import {error} from "./errors/apiError.jsx";

function sort(inputList, sortedList) {
	// Sort an input list by item name using the sortedList
	// The sortedList is a list of item names without the numbers, while
	// the inputList has dictionaries with a list of item names with the numbers

	// May not be the most efficient way, but it's fine
	const sortedInputList = [];
	for (const itemName of sortedList) {
		for (const itemDict of inputList) {
			// Strip number (space and then 1-digit number)
			const itemNameStripped = itemDict.itemName.slice(0, -2);
			if (itemNameStripped === itemName) {
				sortedInputList.push(itemDict);
			}
		}
	}
	console.log({sortedInputList});
	return sortedInputList;
}

function convertOrderContentToInputList(orderContent) {
	const inputList = [];
	for (const [item, itemInfo] of Object.entries(orderContent)) {
		console.log({item, itemInfo});
		const itemListDictionary = {};

		// Item name
		itemListDictionary.itemName = item;

		// Checkboxes
		itemListDictionary.checkboxes = Object.keys(itemInfo.enchantments.checkboxes);

		// Multiple selection
		itemListDictionary.multipleSelection = itemInfo.enchantments.multipleSelection.map(
			// NOSONAR (this isn't code!)
			// Convert [{"enchantment": true, "enchantment2": false}, {"enchantment": true, "enchantment2": false}]
			// to [["enchantment", "enchantment2"], ["enchantment", "enchantment2"]]
			(multipleSelection) => Object.keys(multipleSelection).map((enchantmentName) => enchantmentName)
		);

		inputList.push(itemListDictionary);
	}
	return inputList;
}

function getDefaultInputContent(itemName, checkboxes, multipleSelection) {
	console.log({itemName, checkboxes, multipleSelection});

	const defaultInputContent = {enchantments: {checkboxes: {}, multipleSelection: []}, name: "", additional: ""};

	// Get default checkboxes and multiple selection
	const defaultCheckboxes = {};
	for (const checkbox of checkboxes) {
		defaultCheckboxes[checkbox] = false;
	}
	defaultInputContent.enchantments.checkboxes = defaultCheckboxes;

	const defaultMultipleSelection = [];
	for (const multipleSelectionList of multipleSelection) {
		const multipleSelectionDict = {};
		for (const multipleSelectionEnchantment of multipleSelectionList) {
			multipleSelectionDict[multipleSelectionEnchantment] = false;
		}
		defaultMultipleSelection.push(multipleSelectionDict);
	}
	defaultInputContent.enchantments.multipleSelection = defaultMultipleSelection;

	return defaultInputContent;
}

export default function FormEnchants(props) {
	const history = useHistory();

	const [sortedList, setSortedList] = useState(null);
	const [enchantDict, setEnchantDict] = useState(null);
	const [itemInputs, setItemInputs] = useState(null);
	const [enchantCheckboxRefsState, setEnchantCheckboxRefsState] = useState({});
	const enchantCheckboxRefs = useRef({});
	const inputContent = useRef({});
	const inputList = useRef([]);
	const needToUpdate = useRef(false);

	const enchantCheckboxRef = useCallback((node) => {
		if (!node) return;

		const itemFor = node.getAttribute("item-for");
		const enchantment = node.getAttribute("enchant");

		enchantCheckboxRefs.current[itemFor] = enchantCheckboxRefs.current[itemFor] || {};
		enchantCheckboxRefs.current[itemFor][enchantment] = node;

		console.log(enchantCheckboxRefs.current);

		setEnchantCheckboxRefsState(enchantCheckboxRefs.current);
	}, []);

	function fetchData() {
		return post("api/get-enchants-for-gear", Object.keys(props.orderNumberDictionary))
			.then((resp) => {
				if (!resp.data.worked)
					throw Error(`Failed to get enchantments for gear... is the gear invalid? (${resp.data.message}, code ${resp.data.code})`);
				setSortedList(resp.data.data.sorted_list);
				setEnchantDict(resp.data.data.enchant_dict);
			})
			.catch((resp) => {
				error(resp);
				history.push("/api-error");
			});
	}

	useEffect(() => {
		// If no information available, fetch the data
		// if (!props.orderContent) {
		// fetchData();
		// return;
		// }
		//
		// Hey, has the information (number of items) been changed?

		// if (needToUpdate.current) {
		// We have to fetch the data again, but we can use the old data as well.
		// So, we have to mix the data together a bit
		// fetchData();
		// }

		fetchData();
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	// Data changed
	useEffect(() => {
		// Also don't do anything if the data is still loading
		if (!(sortedList && enchantDict)) return;

		needToUpdate.current =
			props.orderNumberDictionary !== props.saveData.current.enchantPage.orderNumberDictionary &&
			props.saveData.current.enchantPage.orderNumberDictionary;

		// Wait! This might have been updated due to there being existing data, but needing to update the data
		// (i.e. the user changed the number of items)
		console.log(needToUpdate.current ? "Need to update" : "No need to update");
		if (needToUpdate.current) {
			// Because of this, we have to update the data with some sort of primitive "diffs"
			updateData();
			return;
		}
		// No need to update, let's just use the data we have
		const orderContent = props.saveData.current.enchantPage.orderContent || props.orderContent;
		console.log("no need to update ", {orderContent});
		if (orderContent) return load(orderContent);

		const defaultInputList = [];
		const defaultInputContent = {general: {estimatedCost: props.estimatedCost}};

		for (const item of sortedList) {
			const orderedNumber = props.orderNumberDictionary[item];

			for (let currNumber = 1; currNumber <= orderedNumber; currNumber++) {
				const itemName = `${item} ${currNumber}`;
				const checkboxes = enchantDict[item].checkboxes;
				const multipleSelection = enchantDict[item].multipleSelection;

				defaultInputList.push({itemName: itemName, checkboxes: checkboxes, multipleSelection: multipleSelection});
				defaultInputContent[itemName] = getDefaultInputContent(itemName, checkboxes, multipleSelection);
			}
		}

		// Do the HTML stuffs
		inputContent.current = defaultInputContent;
		inputList.current = defaultInputList;
		render();
	}, [sortedList, enchantDict]); /* eslint-disable-line react-hooks/exhaustive-deps */

	function render() {
		renderItemInputs({
			inputList: inputList.current,
			inputContent: inputContent,
			enchantCheckboxRef: enchantCheckboxRef,
			setItemInputs: setItemInputs,
		});
	}

	// Check current checkboxes
	useEffect(() => {
		console.log("hello");
		if (!Object.keys(enchantCheckboxRefsState).length) return;
		// Make sure the number of items are the same. Since this is going off of state, it's possible that the number of items
		// has changed since the last time this ran.
		// if (Object.keys(enchantCheckboxRefsState).length !== Object.keys(inputContent.current)) return;
		console.log("id-purple inputcont", inputContent.current);
		if (!inputContent.current) return;

		console.log("id-purple ---");
		console.log("id-purple checkbox refs", enchantCheckboxRefs.current);
		console.log(Object.entries(enchantCheckboxRefs.current));

		// Check the current checkboxes
		for (const [itemName, itemCheckboxes] of Object.entries(enchantCheckboxRefs.current)) {
			console.log("id-purple itemName", itemName);
			for (const checkbox of Object.keys(itemCheckboxes)) {
				console.log("id-purple checkbox", checkbox);
				console.log(`id-purple ${checkbox} for ${itemName} is ${inputContent.current[itemName].enchantments.checkboxes[checkbox]}`);
				if (inputContent.current[itemName].enchantments.checkboxes[checkbox]) {
					console.log(`id-purple Checking ${checkbox} for ${itemName}`);
					enchantCheckboxRefs.current[itemName][checkbox].checked = true;
				}
			}
		}

		console.log("id-purple forcing update");
		setEnchantCheckboxRefsState({});
	}, [enchantCheckboxRefsState, inputContent]);

	function save() {
		const data = {orderContent: inputContent.current, orderNumberDictionary: props.orderNumberDictionary};
		console.log("id-orange data", data);
		props.saveData.current.enchantPage = data;
		console.log(data);
	}

	function load(orderContent) {
		// Use the information available
		console.log("loading", {orderContent});
		inputContent.current = orderContent;
		// An input list is needed, which looks like [{itemName, checkboxes: [], multipleSelection: []}]
		inputList.current = sort(convertOrderContentToInputList(orderContent), sortedList);
		console.log("id-green", {orderContent, inputList: inputList.current});
		// Do the HTML stuffs
		render();
	}

	function updateData() {
		needToUpdate.current = false;

		console.log("updating data");

		console.log(enchantDict);
		const oldData = props.saveData.current.enchantPage.orderContent;
		const newData = oldData;

		// Go through the old data and update the new data
		for (const item of sortedList) {
			const currentNumber = props.orderNumberDictionary[item];
			const lastNumber = props.saveData.current.enchantPage.orderNumberDictionary[item] || 0;

			console.log({currentNumber, lastNumber});

			// New item if there is a higher amount in the new data than the old data
			if (currentNumber > lastNumber) {
				console.log("new item");
				// New item
				for (let currNumber = lastNumber + 1; currNumber <= currentNumber; currNumber++) {
					console.log({currNumber});

					const itemName = `${item} ${currNumber}`;
					newData[itemName] = getDefaultInputContent(itemName, enchantDict[item].checkboxes, enchantDict[item].multipleSelection);
				}
			}
			// Remove item if there is a lower amount in the new data than the old data
			else if (
				!props.orderNumberDictionary[item] || // undefined means 0
				props.saveData.current.enchantPage.orderNumberDictionary[item] > props.orderNumberDictionary[item]
			) {
				console.log("removing items");
				// Remove item
				for (let currNumber = (currentNumber || 0) + 1; currNumber <= lastNumber; currNumber++) {
					const itemName = `${item} ${currNumber}`;
					console.log({itemName});
					console.log("pre delete");
					console.log(newData[itemName]);
					delete newData[itemName];
					console.log("post delete");
					console.log(newData[itemName]);
				}
			}

			console.log("identifier-red props.orderNumberDictionary[item] is", props.orderNumberDictionary[item], "for item", item);

			console.log(
				"props.orderNumberDictionary[item], props.saveData.current.enchantPage.orderNumberDictionary[item]",
				props.orderNumberDictionary[item],
				props.saveData.current.enchantPage.orderNumberDictionary[item]
			);
		}

		console.log({newData, oldData});

		// Update the data
		load(newData);
	}

	return (
		<BaseWidget className="text-xl text-center">
			<p className="font-semibold">Form</p>
			<p className="font-thin">Select your enchantments for your selected gear.</p>
			{itemInputs ? (
				<>
					<FormWidget>{itemInputs}</FormWidget>
					<div
						onClick={() => {
							save();
							props.nextPage();
						}}
					>
						<Button>Next page</Button>
					</div>
					<div
						onClick={() => {
							save();
							props.prevPage();
						}}
					>
						<Button>Previous page</Button>
					</div>
				</>
			) : (
				<LoadingWidget />
			)}
		</BaseWidget>
	);
}
