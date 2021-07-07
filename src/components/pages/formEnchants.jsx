// Form enchants page
/* TODO: REFACTOR!!
 * I just got back to this code and
 * very yikes indeed
 */

import {useState, useEffect, useRef} from "react";
import {post} from "axios";
import {AllCheckerCheckbox, CheckboxGroup} from "@createnl/grouped-checkboxes";
import {useHistory} from "react-router-dom";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Button from "../boilerplate/button.jsx";
import {EnchantItem, Label, EnchantRadioButton, EnchantCheckbox} from "../formElements.jsx";

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

	// Enchant changed
	function enchantChangedCheckbox(event) {
		const itemFor = event.target.getAttribute("item-for");
		const enchantment = event.target.getAttribute("enchant");
		const checked = event.target.checked;

		const newCheckboxes = inputContent.current[itemFor].enchantments.checkboxes;
		newCheckboxes[enchantment] = checked;
		inputContent.current = {
			...inputContent.current,
			[itemFor]: {...inputContent.current[itemFor], enchantments: {...inputContent.current[itemFor].enchantments, checkboxes: newCheckboxes}},
		};
	}
	function enchantChangedRadio(event) {
		const itemFor = event.target.getAttribute("item-for");
		const enchantment = event.target.getAttribute("enchant");
		const selectionList = String(event.target.getAttribute("selection-list")).split(",");

		const newMultipleSelection = inputContent.current[itemFor].enchantments.multipleSelection;

		// Get the list index based off of an item in selectionList
		for (const multipleSelectionDict of newMultipleSelection) {
			// Check if one of the keys for the multiple selection dict isn't the first key of the selectionList
			if (!Object.keys(multipleSelectionDict).includes(selectionList[0])) continue;

			// This is the correct list.
			// Set everything in it to be false
			for (const enchantment of Object.keys(multipleSelectionDict)) multipleSelectionDict[enchantment] = false;

			// If the enchantment is null, that means it's a none checkbox and we can end here.
			if (enchantment === null) break;

			// Set enchantment selected to true
			multipleSelectionDict[enchantment] = true;
		}

		inputContent.current = {
			...inputContent.current,
			[itemFor]: {
				...inputContent.current[itemFor],
				enchantments: {...inputContent.current[itemFor].enchantments, multipleSelection: newMultipleSelection},
			},
		};
	}

	// All enchant checkbox
	function allEnchantCheckboxChanged(event) {
		const itemFor = event.target.getAttribute("item-for");
		const checked = event.target.checked;

		const newCheckboxes = inputContent.current[itemFor].enchantments.checkboxes;
		// Update everything at once
		for (const enchantment of Object.keys(newCheckboxes)) newCheckboxes[enchantment] = checked;

		inputContent.current = {
			...inputContent.current,
			[itemFor]: {...inputContent.current[itemFor], enchantments: {...inputContent.current[itemFor].enchantments, checkboxes: newCheckboxes}},
		};
	}

	// Text input changed
	function textInputChanged({event, keyFor, textKey}) {
		const textValue = event.target.value;

		inputContent.current = {
			...inputContent.current,
			[keyFor]: {...inputContent.current[keyFor], [textKey]: textValue},
		};
	}

	// Item name changed
	function itemNameChanged(event) {
		const itemFor = event.target.getAttribute("item-for");
		textInputChanged({event: event, keyFor: itemFor, textKey: "name"});
	}

	// Item additional changed
	function itemAdditionalChanged(event) {
		const itemFor = event.target.getAttribute("item-for");
		textInputChanged({event: event, keyFor: itemFor, textKey: "additional"});
	}

	// Render item inputs
	function renderItemInputs({inputList}) {
		setItemInputs(
			inputList.map((item) => (
				<div className="block w-full px-8 py-4 text-center bg-pink-300 rounded-lg" key={`${item.itemName}`}>
					<p className="mx-auto font-bold">{item.itemName}</p>

					{/* Item name */}
					<div className="name">
						<label>
							<p>Name of {item.itemName}</p>
							<input
								type="text"
								name={`${item.itemName} Name`}
								className="w-full"
								maxLength={55}
								item-for={item.itemName}
								onChange={itemNameChanged}
							/>
						</label>
					</div>

					<div className="mx-auto my-2">
						{/* Checkboxes */}
						<div className="checkboxes">
							<CheckboxGroup>
								{/* Iterate through each enchant */}
								{item.checkboxes.map((enchant) => (
									<Label key={`${item.itemName} ${enchant}`}>
										<EnchantCheckbox itemName={item.itemName} enchant={enchant} onChange={enchantChangedCheckbox} />
										<EnchantItem>{enchant}</EnchantItem>
									</Label>
								))}
								<hr className="border-black" />
								{/* All of the above */}
								<Label>
									<AllCheckerCheckbox item-for={item.itemName} checkbox-list={item.checkboxes} onChange={allEnchantCheckboxChanged} />
									<EnchantItem>All of the above</EnchantItem>
								</Label>
							</CheckboxGroup>
						</div>
						{/* Multiple selection */}
						<div className="multiple-selection">
							{/* Iterate through each list */}
							{item.multipleSelection.map((multipleSelectionList, listIndex) => (
								<div key={`Multiple selection list ${listIndex} for ${item.itemName} wrapper wrapper`}>
									{multipleSelectionList.length > 0 && (
										<div className="my-4" key={`Multiple selection list ${listIndex} for ${item.itemName} wrapper`}>
											{/* Iterate through each enchant */}
											{multipleSelectionList.map((enchant) => (
												<Label key={`Multiple selection enchantment ${enchant} for ${item.itemName}`}>
													<EnchantRadioButton
														enchant={enchant}
														itemName={item.itemName}
														multipleSelectionList={multipleSelectionList}
														onChange={enchantChangedRadio}
														listIndex={listIndex}
													/>
													<EnchantItem>{enchant}</EnchantItem>
												</Label>
											))}
											<hr className="border-black" />
											{/* None */}
											<Label>
												<EnchantRadioButton
													enchant={null}
													itemName={item.itemName}
													multipleSelectionList={multipleSelectionList}
													onChange={enchantChangedRadio}
													listIndex={listIndex}
													defaultChecked={true}
												/>
												<EnchantItem>None</EnchantItem>
											</Label>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
					{/* Additional information */}
					<div className="additional">
						<label>
							<p>Additional information</p>
							<input
								type="text"
								name={`${item.itemName} Additional`}
								className="w-full"
								maxLength={128}
								item-for={item.itemName}
								onChange={itemAdditionalChanged}
							/>
						</label>
					</div>
				</div>
			))
		);
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
			renderItemInputs({inputList: defaultInputList});
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
