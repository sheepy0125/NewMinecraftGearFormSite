// Form elements
/* This file contains:
 * Enchant item: The text for the enchantment
 * Label: A label element
 * Enchant radio button: A radio button with an enchantment
 * Enchant checkbox: A checkbox with an enchantment
 */

import {Checkbox} from "@createnl/grouped-checkboxes"; // I love you

export function EnchantItem(props) {
	return <p className="mx-2 sm:mx-auto">{props.children}</p>;
}

export function Label(props) {
	return (
		<label className="flex w-full px-1 my-1 bg-blue-200 bg-opacity-25 cursor-pointer" key={props.id || ""}>
			{props.children}
		</label>
	);
}

export function EnchantRadioButton(props) {
	const enchant = props.enchant;
	const itemName = props.itemName;
	const multipleSelectionList = props.multipleSelectionList;
	const onChange = props.onChange;
	const listIndex = props.listIndex;
	const defaultChecked = props.defaultChecked || false;
	console.log(enchant);
	console.log(defaultChecked);

	return (
		<input
			type="radio"
			name={`${itemName} Multiple selection ${listIndex}`}
			onChange={onChange}
			enchant={enchant}
			selection-list={multipleSelectionList}
			item-for={itemName}
			defaultChecked={defaultChecked}
		/>
	);
}

export function EnchantCheckbox(props) {
	const enchant = props.enchant;
	const itemName = props.itemName;
	const onChange = props.onChange;
	const defaultChecked = props.defaultChecked || false;

	return <Checkbox enchant={enchant} name={itemName} onChange={onChange} item-for={itemName} checked={defaultChecked} />;
}

// Dummy enchant checkbox, doesn't do anything, either checked or unchecked forever
export function DummyEnchantCheckbox(props) {
	const selected = props.selected;

	return <input type="checkbox" checked={selected} readOnly />;
}

// Dummy enchant radio button, doesn't do anything, either selected or unselected forever
export function DummyEnchantRadioButton(props) {
	const selected = props.selected;

	return <input type="radio" checked={selected} readOnly />;
}
