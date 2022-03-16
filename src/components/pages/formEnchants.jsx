// Form enchants page

import {useState, useEffect, useRef} from "react";
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

export default function FormEnchants(props) {
	const history = useHistory();

	const [sortedList, setSortedList] = useState(null);
	const [enchantDict, setEnchantDict] = useState(null);
	const [itemInputs, setItemInputs] = useState(null);
	const inputContent = useRef({});

	function fetchData() {
		post("api/get-enchants-for-gear", Object.keys(props.orderNumberDictionary))
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
		// Use the information available
		setEnchantDict(props.orderContent);
		inputContent.current = props.orderContent;
		// An input list is needed, which looks like [{itemName, checkboxes: [], multipleSelection: []}]
		const inputList = convertOrderContentToInputList(props.orderContent);

		// Do the HTML stuff
		renderItemInputs({
			inputList: inputList,
			inputContent: inputContent,
			setItemInputs: setItemInputs,
		});
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	// Data changed
	useEffect(() => {
		// Don't do anything if the data was loaded in
		if (props.orderContent) return;
		// Also don't do anything if the data is still loading
		if (!(sortedList && enchantDict)) return;

		const defaultInputList = [];
		const defaultInputContent = {general: {estimatedCost: props.estimatedCost}};

		for (const item of sortedList) {
			const orderedNumber = props.orderNumberDictionary[item];

			for (let currNumber = 1; currNumber <= orderedNumber; currNumber++) {
				const itemName = `${item} ${currNumber}`;
				const checkboxes = enchantDict[item].checkboxes;
				const multipleSelection = enchantDict[item].multipleSelection;

				defaultInputList.push({itemName: itemName, checkboxes: checkboxes, multipleSelection: multipleSelection});

				// Set default input content
				defaultInputContent[itemName] = {enchantments: {checkboxes: {}, multipleSelection: []}, name: "", additional: ""};

				// Get default checkboxes and multiple selection
				const defaultCheckboxes = defaultInputContent[itemName].enchantments.checkboxes;
				for (const checkbox of checkboxes) {
					defaultCheckboxes[checkbox] = false;
				}
				defaultInputContent[itemName].enchantments.checkboxes = defaultCheckboxes;

				const defaultMultipleSelection = defaultInputContent[itemName].enchantments.multipleSelection;
				for (const multipleSelectionList of multipleSelection) {
					const multipleSelectionDict = {};
					for (const multipleSelectionEnchantment of multipleSelectionList) {
						multipleSelectionDict[multipleSelectionEnchantment] = false;
					}
					defaultMultipleSelection.push(multipleSelectionDict);
				}
				defaultInputContent[itemName].enchantments.multipleSelection = defaultMultipleSelection;
			}
		}

		// Do the HTML stuffs
		inputContent.current = defaultInputContent;
		// We need to pass the inputContent ref here so it can be set as well as read
		renderItemInputs({inputList: defaultInputList, inputContent: inputContent, setItemInputs: setItemInputs});
	}, [sortedList, enchantDict]); /* eslint-disable-line react-hooks/exhaustive-deps */

	return (
		<BaseWidget className="text-xl text-center">
			<p className="font-semibold">Form</p>
			<p className="font-thin">Select your enchantments for your selected gear.</p>
			{itemInputs ? (
				<>
					<FormWidget>{itemInputs}</FormWidget>
					{props.nextPage && (
						<div onClick={() => props.nextPage(inputContent.current)}>
							<Button>Next page</Button>
						</div>
					)}
				</>
			) : (
				<LoadingWidget />
			)}
		</BaseWidget>
	);
}
