// Enchantment dictionary page

import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Button from "../boilerplate/button.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import {TableColumn, MobileTableColumn, MobileTableRow} from "../boilerplate/table.jsx";

// Show mobile table column
function showMobileTableColumn({columnName, type}) {
	// If the type is a list, then show each item
	let show = columnName;
	if (type === "list") {
		show = (
			<>
				{columnName.map((item, index) => (
					<p key={`list ${item} ${index}`}>{item}</p>
				))}
			</>
		);
	}

	return columnName.length !== 0 ? show : null;
}

export default function EnchantmentDictionary() {
	const history = useHistory();

	const [enchantments, setEnchantments] = useState(null);

	// Fetch enchantments
	function fetchEnchantments() {
		get("api/get-enchantment-dictionary")
			.then((resp) => {
				setEnchantments(convertToHTML(resp.data.data));
			})
			.catch((resp) => {
				history.push("/api-error");
			});
	}

	// Convert to HTML
	function convertToHTML(enchantmentsData) {
		const columns = [
			{name: "Name", valueName: "name", type: "text"},
			{name: "Maximum level", valueName: "maximumLevel", type: "text"},
			{name: "Purpose", valueName: "purpose", type: "text"},
			{name: "Compatible items", valueName: "compatibleItems", type: "list"},
			{name: "Incompatible enchantments", valueName: "incompatibleEnchants", type: "list"},
		];

		return (
			<>
				{/* Mobile */}
				<div className="block xl:hidden">
					{enchantmentsData.map((enchantment, enchantmentID) => (
						<div key={enchantment.name} className="text-sm lg:text-base">
							<div className="border border-black">
								{columns.map((row) => (
									<MobileTableRow key={`${row.name} mobile`}>
										<MobileTableColumn title>{row.name}</MobileTableColumn>
										<MobileTableColumn>
											{showMobileTableColumn({columnName: enchantment[row.valueName], type: row.type}) || "N/A"}
										</MobileTableColumn>
									</MobileTableRow>
								))}
							</div>

							{/* Line break to show difference between orders */}
							{/* Don't show on last order though */}
							{enchantmentID < enchantmentsData.length - 1 && <br />}
						</div>
					))}
				</div>
				{/* Desktop */}
				<table className="hidden w-full mx-auto border border-black xl:table">
					<thead>
						<tr className="flex">
							{columns.map((row) => (
								<TableColumn key={`${row.name} desktop key`}>{row.name}</TableColumn>
							))}
						</tr>
					</thead>

					<tbody>
						{enchantmentsData.map((enchantment) => (
							<tr className="flex font-thin" key={`${enchantment.name} desktop`}>
								{columns.map((row) => (
									<TableColumn key={row.valueName}>
										{showMobileTableColumn({columnName: enchantment[row.valueName], type: row.type})}
									</TableColumn>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</>
		);
	}

	// Fetch enchantments on first load
	useEffect(() => {
		fetchEnchantments();
	}, []); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Enchantment dictionary</Title>
			<Navbar currentPage="/enchantment-dictionary" />
			<BaseWidget className="text-center text-lg">
				<p>Enchantment dictionary</p>
				{enchantments ? <>{enchantments}</> : <LoadingWidget />}
				<br />
				<Button>
					<a href="/api/get-enchantment-dictionary">Get this in JSON form</a>
				</Button>
			</BaseWidget>
		</MainWidget>
	);
}
