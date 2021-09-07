// Form inupts editing
// Inputs for when editing

import {AllCheckerCheckbox, CheckboxGroup} from "@createnl/grouped-checkboxes";
import {EnchantItem, Label, EnchantRadioButton, EnchantCheckbox} from "./formElements.jsx";

/* In order to have access to inputList, setItemInputs, and inputContent, we have to wrap everything
 * in this function. It'd be better not to have to do this...
 * TODO: refactor to not have this
 */
export default function renderItemInputs({inputList, setItemInputs, inputContent}) {
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

	// See /src/itemInputsModel.txt
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
