// Handler for selection and enchanting pages combined

import {useState, useEffect, useRef} from "react";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import FormSelection from "./formSelection.jsx";
import FormEnchants from "./formEnchants.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import SubmitOrderEdit from "../submitOrderEdit.jsx";
import AuthenticationWidget from "../authentication.jsx";

function getOrderNumberDictionary(orderContent) {
	// Get the order number dictionary from the order content
	const orderNumberDictionary = {};

	// The item with the highest number at the end of it will be the number of items
	for (const item of Object.keys(orderContent)) {
		const itemNameStripped = item.slice(0, -2);
		const itemNumber = Number(item.slice(-1));
		orderNumberDictionary[itemNameStripped] = itemNumber;
	}

	return orderNumberDictionary;
}

export default function FormEditing(props) {
	const [currentPage, setCurrentPage] = useState(null);
	const saveData = useRef({selectPage: {}, enchantPage: {}});

	// Form pages
	function gearSelectionPage() {
		return <FormSelection nextPage={goToEnchantSelectionPage} saveData={saveData} />;
	}
	function enchantSelectionPage() {
		return (
			<FormEnchants
				orderNumberDictionary={saveData.current.selectPage.orderNumberDictionary}
				orderContent={(saveData.enchantPage && saveData.enchantPage.orderContent) || props.orderContent}
				nextPage={goToEnterPINPage}
				prevPage={goToGearSelectionPage}
				saveData={saveData}
			/>
		);
	}

	// Page transitions
	function goToGearSelectionPage() {
		setCurrentPage(gearSelectionPage());
	}
	function goToEnchantSelectionPage() {
		setCurrentPage(enchantSelectionPage());
	}
	function goToEnterPINPage() {
		// Authentication widget page
		setCurrentPage();
	}

	useEffect(() => {
		console.log("id-orange ORDER CONTENT PROPS CHANGED");
		// If there's order content but not an order number dictionary, obtain it
		if (props.orderContent && !saveData.current.selectPage.orderNumberDictionary) {
			saveData.current.selectPage.orderNumberDictionary = getOrderNumberDictionary(props.orderContent);
		}
		setCurrentPage(props.orderContent ? enchantSelectionPage() : <LoadingWidget />);
	}, [props.orderContent]);

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form (editing)</Title>
			<Navbar currentPage="/edit-order" />
			{currentPage}
		</MainWidget>
	);
}
