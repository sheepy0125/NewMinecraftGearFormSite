// Handler for selection and enchanting pages combined
import {useState} from "react";

import FormSelection from "./formSelection.jsx";
import FormEnchants from "./formEnchants.jsx";

export default function Form() {
	const [gearOrderData, setGearOrderData] = useState({});
	const [isSelecting, setIsSelecting] = useState(true);

	// Go to next page
	function goToNextPage({orderNumberDictionary, totalPrice}) {
		setIsSelecting(false);
		setGearOrderData({orderNumberDictionary: orderNumberDictionary, totalPrice: totalPrice});
	}

	return isSelecting ? (
		<FormSelection goToNextPage={goToNextPage} setIsSelecting={setIsSelecting} />
	) : (
		<FormEnchants orderNumberDictionary={gearOrderData.orderNumberDictionary} totalPrice={gearOrderData.totalPrice} />
	);
}
