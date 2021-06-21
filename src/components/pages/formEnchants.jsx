// Form enchants page

import {useState, useEffect} from "react";
import {post} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Button from "../boilerplate/button.jsx";

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

			// Now, make it render-able (lol)
			setItemInputs(
				inputList.map((item) => (
					<div className="mx-auto max-w-max">
						<hr className="border-2 border-b-0 border-black" />
						<p className="mx-auto font-bold">{item.itemName}</p>

						{/* Item name */}
						<label>
							<p>{`Name of ${item.itemName}`}</p>
							<br />
							<input type="text" name={`${item.itemName} Name`} className="w-full" />
							<br />
						</label>

						<div className="mx-auto max-w-max">
							{/* Checkboxes */}
							{item.checkboxes && (
								<>
									<br />
									{item.checkboxes.map((enchant) => (
										<label>
											<div className="flex">
												<input type="checkbox" name={`${item.itemName} Checkbox ${enchant}`} />
												<pre>
													<p className="break-words"> {enchant}</p>
												</pre>
											</div>
										</label>
									))}
								</>
							)}

							{/* Multiple selection */}
							{item.multipleSelection && (
								<>
									<br />
									{item.multipleSelection.map((multipleSelectionList, index) => (
										<>
											{multipleSelectionList.map((enchant) => (
												<label className="mx-0 text-left">
													<div className="flex">
														<input type="radio" name={`${item.itemName} MultipleSelection ${index + 1}`} value={enchant} />
														<pre>
															<p className="break-all"> {enchant}</p>
														</pre>
													</div>
												</label>
											))}
											<span className="py-4 my-4"></span>
											<br />
										</>
									))}
								</>
							)}
						</div>
					</div>
				))
			);
		}
	}, [sortedList, enchantDict]); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Select your enchantments for your selected gear.</p>
				{itemInputs !== null ? <BaseWidget>{itemInputs}</BaseWidget> : <LoadingWidget />}
			</BaseWidget>
		</MainWidget>
	);
}
