// Form enchants page

import {useState, useEffect} from "react";
import {post} from "axios";
import {AllCheckerCheckbox, Checkbox, CheckboxGroup} from "@createnl/grouped-checkboxes";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

// Enchant item
function EnchantItem(props) {
	return <p className="mx-2 sm:mx-auto">{props.children}</p>;
}

// Label
function Label(props) {
	return (
		<label className="flex w-full px-1 my-1 bg-pink-200 bg-opacity-25 cursor-pointer" key={props.id || ""}>
			{props.children}
		</label>
	);
}

// Enchant radio button
function EnchantRadioButton(props) {
	const enchant = props.enchant;
	const itemName = props.itemName;
	const multipleSelectionList = props.multipleSelectionList;
	const onChange = props.onChange;
	const listIndex = props.listIndex;
	const defaultChecked = props.defaultChecked || false;

	return (
		<input
			type="radio"
			name={`${itemName} Multiple selection ${listIndex}`}
			onChange={onChange}
			enchant={enchant}
			selection-list={multipleSelectionList}
			for={itemName}
			defaultChecked={defaultChecked}
		/>
	);
}

// Enchant checkbox
function EnchantCheckbox(props) {
	const enchant = props.enchant;
	const itemName = props.itemName;
	const onChange = props.onChange;

	return <Checkbox enchant={enchant} name={itemName} onChange={onChange} for={itemName} />;
}

// Form enchants
export default function FormEnchants(props) {
	const [sortedList, setSortedList] = useState(null);
	const [enchantDict, setEnchantDict] = useState(null);
	const [itemInputs, setItemInputs] = useState(null);
	const [inputContent, setInputContent] = useState({});

	// Fetch the data
	function fetchData() {
		post("/get_enchants_for_gear", Object.keys(props.orderNumberDictionary)).then((resp) => {
			setSortedList(resp.data.data.sorted_list);
			setEnchantDict(resp.data.data.enchant_dict);
		});
	}

	// Enchant changed
	function enchantChangedCheckbox(event) {
		const itemFor = event.target.getAttribute("for");
		const enchantment = event.target.getAttribute("enchant");
		const checked = event.target.checked;

		console.log({event: event, itemFor: itemFor, enchantment: enchantment, checked: checked});

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
		const itemFor = event.target.getAttribute("for");
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
		const itemFor = event.target.getAttribute("for");
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
		const itemFor = event.target.getAttribute("for");
		textInputChanged({event: event, keyFor: itemFor, textKey: "name"});
	}

	// Item additional changed
	function itemAdditionalChanged(event) {
		const itemFor = event.target.getAttribute("for");
		textInputChanged({event: event, keyFor: itemFor, textKey: "additional"});
	}

	useEffect(() => {
		console.log("%c New input content is here! Here it is...", "color: green; font-weight: 600; font-size: 1.5rem;");
		console.log(
			`%c${JSON.stringify(inputContent, null, 4)}`,
			"color: black; background-color: skyblue; font-weight: 100; max-width: max-content; font-size: 0.875rem;"
		);
	}, [inputContent]);

	// Render item inputs
	function renderItemInputs({inputList}) {
		setItemInputs(
			inputList.map((item) => (
				<div className="block w-full px-8 py-4 my-2 text-center bg-pink-300 rounded-lg md:my-0" key={`${item.itemName}`}>
					<p className="mx-auto font-bold">{item.itemName}</p>

					{/* Item name */}
					<label>
						<p>Name of {item.itemName}</p>
						<input type="text" name={`${item.itemName} Name`} className="w-full" maxLength={55} for={item.itemName} onChange={itemNameChanged} />
					</label>

					<div className="mx-auto my-2">
						{/* Checkboxes */}
						{item.checkboxes && (
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
									<AllCheckerCheckbox for={item.itemName} checkbox-list={item.checkboxes} onChange={allEnchantCheckboxChanged} />
									<EnchantItem>All of the above</EnchantItem>
								</Label>
							</CheckboxGroup>
						)}

						{/* Multiple selection */}
						{item.multipleSelection && (
							<div>
								{/* Iterate through each list */}
								{item.multipleSelection.map((multipleSelectionList, listIndex) => (
									<div className="my-4" key={`${item.itemName} multiple selection list ${listIndex}`}>
										{/* Iterate through each enchant */}
										{multipleSelectionList.map((enchant) => (
											<Label key={`${item.itemName} multiple selection ${enchant}`}>
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
											/>
											<EnchantItem>None</EnchantItem>
										</Label>
									</div>
								))}
							</div>
						)}
					</div>
					{/* Additional information */}
					<label>
						<p>Additional information</p>
						<input type="text" name={`${item.itemName} Additional`} className="w-full" maxLength={128} for={item.itemName} onChange={itemAdditionalChanged} />
					</label>
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
			const defaultInputContent = {general: {username: null, additional: null}};

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
					<BaseWidget className="grid-cols-2 gap-2 mx-auto bg-pink-400 lg:grid-cols-3 xl:grid-cols-4 md:grid">{itemInputs}</BaseWidget>
				) : (
					<LoadingWidget />
				)}
			</BaseWidget>
		</MainWidget>
	);
}
