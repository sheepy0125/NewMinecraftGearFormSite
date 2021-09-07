// Form inputs viewing
// Used for displaying form inputs when the user is viewing an order, so not functional

import {EnchantItem, Label, DummyEnchantRadioButton, DummyEnchantCheckbox} from "./formElements.jsx";

export default function renderFormInputs({inputList, setItemInputs}) {
	// See /src/itemInputsModel.txt
	setItemInputs(
		inputList.map((item) => (
			<div className="block w-full px-8 py-4 text-center bg-pink-300 rounded-lg" key={`${item.defaultItemName}`}>
				<p className="mx-auto font-bold">{item.defaultItemName}</p>

				{/* Item name */}
				<div className="name">
					<label>
						<p>Name of {item.defaultItemName}</p>
						<input type="text" className="w-full" value={item.itemName} readOnly />
					</label>
				</div>

				{/* Checkboxes */}
				<div className="checkboxes">
					{/* Iterate through each enchant */}
					{Object.keys(item.checkboxes).map((enchant) => (
						<Label key={`${item.itemName} ${enchant}`}>
							<DummyEnchantCheckbox selected={item.checkboxes[enchant]} />
							<EnchantItem>{enchant}</EnchantItem>
						</Label>
					))}
					<hr className="border-black" />
				</div>

				{/* Multiple selection */}
				<div className="multiple-selection">
					{/* Iterate through each list */}
					{item.multipleSelection.map((multipleSelectionObject, listIndex) => (
						<div key={`Multiple selection list ${listIndex} for ${item.itemName} wrapper wrapper`}>
							{Object.keys(multipleSelectionObject).length > 0 && (
								<div className="my-4" key={`Multiple selection list ${listIndex} for ${item.itemName} wrapper`}>
									{/* Iterate through each enchant */}
									{Object.keys(multipleSelectionObject).map((enchant) => (
										<Label key={`Multiple selection enchantment ${enchant} for ${item.itemName}`}>
											<DummyEnchantRadioButton selected={multipleSelectionObject[enchant]} />
											<EnchantItem>{enchant}</EnchantItem>
										</Label>
									))}
									<hr className="border-black" />
								</div>
							)}
						</div>
					))}
				</div>
				{/* Additional information */}
				<div className="additional">
					<label>
						<p>Additional information</p>
						<input type="text" className="w-full" value={item.additionalInformation} readOnly />
					</label>
				</div>
			</div>
		))
	);
}
