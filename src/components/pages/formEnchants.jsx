// Form enchants page

import {useState, useEffect, useRef, useReducer} from "react";
import {useHistory} from "react-router-dom";
import {post} from "axios";

import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Button from "../boilerplate/button.jsx";
import renderItemInputs from "../formInputsEditing.jsx";
import {error} from "./errors/apiError.jsx";

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
	const inputContent = useRef({});
	// Hack to force an update of the inputContent
	// Because I'm using references to inputContent, the inputs don't update when there's a change
	// in the inputContent.
	// Well, this is problematic for loading from a save, because the "check all" checkboxes think
	// they're not checked when they are, causing the checkboxes to be unchecked.
	// This hack forces an update of the inputContent, which fixes the problem by updating the
	// checkboxes.
	// const [, forceUpdate] = useReducer((x) => x + 1, 0);

	const needToUpdate = useRef(false);

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
		if (!props.orderContent) {
			fetchData();
			return;
		}

		// Hey, has the information (number of items) been changed?
		needToUpdate.current =
			props.orderNumberDictionary !== props.saveData.current.enchantPage.orderNumberDictionary &&
			props.saveData.current.enchantPage.orderNumberDictionary;
		if (needToUpdate.current) {
			// We have to fetch the data again, but we can use the old data as well.
			// So, we have to mix the data together a bit
			fetchData();
		}

		// If we have the data, we can use it
		load(props.orderContent);
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	// Data changed
	useEffect(() => {
		// Also don't do anything if the data is still loading
		if (!(sortedList && enchantDict)) return;

		// Wait! This might have been updated due to there being existing data, but needing to update the data
		// (i.e. the user changed the number of items)
		console.log(needToUpdate.current ? "Need to update" : "No need to update");
		if (needToUpdate.current) {
			// Because of this, we have to update the data with some sort of primitive "diffs"
			updateData();
			return;
		}

		// No need to update
		if (!props.orderContent) return;

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
		// We need to pass the inputContent ref here so it can be set as well as read
		renderItemInputs({
			inputList: defaultInputList,
			inputContent: inputContent,
			setItemInputs: setItemInputs,
		});
	}, [sortedList, enchantDict]); /* eslint-disable-line react-hooks/exhaustive-deps */

	function save() {
		const data = {orderContent: inputContent.current, orderNumberDictionary: props.orderNumberDictionary};
		props.saveData.current.enchantPage = data;
		console.log(data);
	}

	function load(orderContent) {
		// Use the information available
		inputContent.current = orderContent;
		// An input list is needed, which looks like [{itemName, checkboxes: [], multipleSelection: []}]
		const inputList = convertOrderContentToInputList(orderContent);

		console.log({
			orderContent,
			inputList,
			inputContent,
		});

		// Do the HTML stuff
		renderItemInputs({
			inputList: inputList,
			inputContent: inputContent,
			setItemInputs: setItemInputs,
		});
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
				!props.orderNumberDictionary[item] ||
				props.saveData.current.enchantPage.orderNumberDictionary[item] > props.orderNumberDictionary[item]
			) {
				console.log("removing items");
				// Remove item
				for (let currNumber = currentNumber + 1; currNumber <= lastNumber; currNumber++) {
					const itemName = `${item} ${currNumber}`;
					console.log({itemName});
					console.log("pre delete");
					console.log(newData[itemName]);
					delete newData[itemName];
					console.log("post delete");
					console.log(newData[itemName]);
				}
				// The above for loop won't work if the last number is 0 (actually undefined), so we have to do this manually
				console.log("last number check");
				if (!currentNumber) {
					console.log("agreement!");
					delete newData[`${item} 1`];
					console.log("if you see this then it worked... maybe idk read this:");
					console.log(newData);
				} else console.log("didn't work", currentNumber);
			}

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
