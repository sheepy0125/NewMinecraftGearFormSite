// Form enchants page

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
	const [inputContent, setInputContent] = useState({});
	const renderCount = useRef(0);

	useEffect(() => {
		renderCount.current += 1;
	});

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

		setInputContent((prevInputContent) => {
			const newEnchantmentsForItem = prevInputContent[itemFor].enchantments;

			// If checked, push to enchantment list
			if (checked) newEnchantmentsForItem.push(enchantment);
			// Not checked, pop if in list
			else {
				const indexOfEnchnantment = newEnchantmentsForItem.indexOf(enchantment);
				indexOfEnchnantment >= 0 && newEnchantmentsForItem.splice(indexOfEnchnantment, 1);
			}

			return {...prevInputContent, [itemFor]: {...prevInputContent[itemFor], enchantments: newEnchantmentsForItem}};
		});
	}
	function enchantChangedRadio(event) {
		const itemFor = event.target.getAttribute("item-for");
		const enchantment = event.target.getAttribute("enchant");
		const selectionList = String(event.target.getAttribute("selection-list")).split(",");

		setInputContent((prevInputContent) => {
			const newEnchantmentsForItem = prevInputContent[itemFor].enchantments;

			// Go through each enchantment in the multiple selection list and remove the enchantments for the items that match the list
			for (const selectionEnchant of selectionList) {
				const indexOfEnchnantment = newEnchantmentsForItem.indexOf(selectionEnchant);

				// If found, then remove
				if (indexOfEnchnantment >= 0) {
					newEnchantmentsForItem.splice(indexOfEnchnantment, 1);
					break;
				}
			}

			// Add new enchantment if not null
			enchantment && newEnchantmentsForItem.push(enchantment);

			return {...prevInputContent, [itemFor]: {...prevInputContent[itemFor], enchantments: newEnchantmentsForItem}};
		});
	}

	// All enchant checkbox
	function allEnchantCheckboxChanged(event) {
		const itemFor = event.target.getAttribute("item-for");
		const checkboxList = String(event.target.getAttribute("checkbox-list")).split(",");
		const checked = event.target.checked;

		setInputContent((prevInputContent) => {
			const newEnchantmentsForItem = prevInputContent[itemFor].enchantments;

			// Iterate through each checkbox in checkbox list
			for (const checkboxEnchant of checkboxList) {
				// Try to get the checkbox in the enchant list
				const indexOfEnchnantment = newEnchantmentsForItem.indexOf(checkboxEnchant);

				// Remove that (if it exists)
				if (indexOfEnchnantment >= 0) {
					newEnchantmentsForItem.splice(indexOfEnchnantment, 1);
				}

				// If checked, then append it
				if (checked) newEnchantmentsForItem.push(checkboxEnchant);
			}

			return {...prevInputContent, [itemFor]: {...prevInputContent[itemFor], enchantments: newEnchantmentsForItem}};
		});
	}

	// Text input changed
	function textInputChanged({event, keyFor, textKey}) {
		const nameText = event.target.value;

		setInputContent((prevInputContent) => {
			return {...prevInputContent, [keyFor]: {...prevInputContent[keyFor], [textKey]: nameText}};
		});
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

					// Add to input content
					defaultInputContent[itemName] = {enchantments: [], name: "", additional: ""};
				}
			}

			setInputContent(defaultInputContent);
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
						<div onClick={() => props.nextPage(inputContent)}>
							<Button>Next page</Button>
						</div>
					</>
				) : (
					<LoadingWidget />
				)}
			</BaseWidget>
			<p>{renderCount.current}</p>
		</MainWidget>
	);
}
