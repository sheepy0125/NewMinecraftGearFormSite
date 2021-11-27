// Form enchants page

import {useState, useEffect, useRef} from "react";
import {useHistory} from "react-router-dom";
import {post} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Button from "../boilerplate/button.jsx";
import renderItemInputs from "../formInputsEditing.jsx";
import {error} from "./errors/apiError.jsx";

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
		fetchData();
	}, []); /* eslint-disable-line */

	// Data changed
	useEffect(() => {
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
	}, [sortedList, enchantDict]); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Select your enchantments for your selected gear.</p>
				{itemInputs ? (
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
