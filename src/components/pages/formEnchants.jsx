// Form enchants page

import {useState, useEffect} from "react";
import {post} from "axios";
import {AllCheckerCheckbox, Checkbox, CheckboxGroup, NoneCheckerCheckbox} from "@createnl/grouped-checkboxes";

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
		<label className="flex w-full px-1 my-1 bg-pink-200 bg-opacity-25" key={props.key}>
			{props.children}
		</label>
	);
}

// Form enchants
export default function FormEnchants(props) {
	const [sortedList, setSortedList] = useState(null);
	const [enchantDict, setEnchantDict] = useState(null);
	const [itemInputs, setItemInputs] = useState(null);

	// Fetch the data
	function fetchData() {
		post("/get_enchants_for_gear", Object.keys(props.orderNumberDictionary)).then((resp) => {
			setSortedList(resp.data.data.sorted_list);
			setEnchantDict(resp.data.data.enchant_dict);
		});
	}

	// Render item inputs
	function renderItemInputs({inputList}) {
		setItemInputs(
			inputList.map((item, itemIndex) => (
				<div className="block w-full px-8 py-4 my-2 text-center bg-pink-300 rounded-lg md:my-0" key={`${item.itemName}`}>
					<p className="mx-auto font-bold">{item.itemName}</p>

					{/* Item name */}
					<label>
						<p>{`Name of ${item.itemName}`}</p>
						<input type="text" name={`${item.itemName} Name`} className="w-full" maxLength={55} />
					</label>

					<div className="mx-auto my-2">
						{/* Checkboxes */}
						{item.checkboxes && (
							<div>
								<CheckboxGroup>
									{item.checkboxes.map((enchant) => (
										<Label key={`${item.itemName} ${enchant}`}>
											<Checkbox value={enchant} name={`${item.itemName}`} />
											<EnchantItem>{enchant}</EnchantItem>
										</Label>
									))}
									<hr className="border-black" />
									<Label>
										<AllCheckerCheckbox />
										<EnchantItem>All of the above</EnchantItem>
									</Label>
								</CheckboxGroup>
							</div>
						)}

						{/* Multiple selection */}
						{item.multipleSelection && (
							<>
								{item.multipleSelection.map((multipleSelectionList, listIndex) => (
									<div className="my-4" key={`${item.itemName} multiple selection list ${listIndex}`}>
										{multipleSelectionList.map((enchant) => (
											<Label key={`${item.itemName} multiple selection ${enchant}`}>
												<input type="radio" name={`${item.itemName} MultipleSelection ${listIndex + 1}`} value={enchant} />
												<EnchantItem>{enchant}</EnchantItem>
											</Label>
										))}
										<hr className="border-black" />
										<Label>
											<input type="radio" name={`${item.itemName} MultipleSelection ${listIndex + 1}`} defaultChecked value={null} />
											<EnchantItem>None</EnchantItem>
										</Label>
									</div>
								))}
							</>
						)}

						{/* Additional information */}
						<label>
							<p>Additional information</p>
							<input type="text" name={`${item.itemName} Additional`} className="w-full" maxLength={512} />
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
			const inputList = [];

			// Iterate through each item ordered
			for (const item of sortedList) {
				// Check how many of the item were ordered
				const orderedNumber = props.orderNumberDictionary[item];

				// For the number that it was ordered, append to inputList
				for (let currNumber = 1; currNumber <= orderedNumber; currNumber++) {
					const itemName = `${item} ${currNumber}`;
					const checkboxes = enchantDict[item].checkboxes;
					const multipleSelection = enchantDict[item].multipleSelection;

					inputList.push({itemName: itemName, checkboxes: checkboxes, multipleSelection: multipleSelection});
				}
			}

			renderItemInputs({inputList: inputList});
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
