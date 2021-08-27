// Form enchants page

import {useState, useEffect, useRef} from "react";
import {post} from "axios";
import {useHistory} from "react-router-dom";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Button from "../boilerplate/button.jsx";
import renderItemInputs from "../formInputsEditing.jsx";

// Form enchants
export default function FormEnchants(props) {
	const history = useHistory();

	const [sortedList, setSortedList] = useState(null);
	const [enchantDict, setEnchantDict] = useState(null);
	const [itemInputs, setItemInputs] = useState(null);
	const inputContent = useRef({});

	// Fetch the data
	function fetchData() {
		post("/get_enchants_for_gear", Object.keys(props.orderNumberDictionary))
			.then((resp) => {
				setSortedList(resp.data.data.sorted_list);
				setEnchantDict(resp.data.data.enchant_dict);
			})
			.catch((resp) => {
				history.push("/api-error");
			});
	}

	// Fetch data upon first load
	useEffect(() => {
		fetchData();
	}, []); /* eslint-disable-line */

	// Data has changed
	useEffect(() => {
		if (sortedList && enchantDict) {
			// They both have data, fetch the inputs
			const defaultInputList = [];
			const defaultInputContent = {general: {username: null, additional: null, estimatedCost: props.estimatedCost}};

			// Iterate through each item ordered
			for (const item of sortedList) {
				// Check how many of the item were ordered
				const orderedNumber = props.orderNumberDictionary[item];

				// For the number that it was ordered, append to inputList
				for (let currNumber = 1; currNumber <= orderedNumber; currNumber++) {
					const itemName = `${item} ${currNumber}`;
					const checkboxes = enchantDict[item].checkboxes;
					const multipleSelection = enchantDict[item].multipleSelection;

					// Add to input list
					defaultInputList.push({itemName: itemName, checkboxes: checkboxes, multipleSelection: multipleSelection});

					// Set default input content
					defaultInputContent[itemName] = {enchantments: {checkboxes: {}, multipleSelection: []}, name: "", additional: ""};

					// Get default checkboxes
					const defaultCheckboxes = defaultInputContent[itemName].enchantments.checkboxes;
					for (const checkbox of checkboxes) {
						defaultCheckboxes[checkbox] = false;
					}
					defaultInputContent[itemName].enchantments.checkboxes = defaultCheckboxes;

					// Get default multiple selection
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

			inputContent.current = defaultInputContent;
			renderItemInputs({inputList: defaultInputList, inputContent: inputContent, setItemInputs: setItemInputs});
		}
	}, [sortedList, enchantDict]); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Select your enchantments for your selected gear.</p>
				{itemInputs !== null ? (
					<>
						<FormWidget>{itemInputs}</FormWidget>
						<div onClick={() => props.nextPage(inputContent.current)}>
							<Button>Next page</Button>
						</div>
					</>
				) : (
					<LoadingWidget />
				)}
			</BaseWidget>
		</MainWidget>
	);
}
