// Handler for selection and enchanting pages combined
import {useState} from "react";

import NotImplemented from "./errors/notImplemented.jsx";
import FormSelection from "./formSelection.jsx";

export default function Form() {
	const [gearToOrder, setGearToOrder] = useState({}); // Example: {"Sword": 5, "Pickaxe": 2} (item: count)
	const [isSelecting, setIsSelecting] = useState(true);

	return isSelecting ? <FormSelection setGearToOrder={setGearToOrder} setIsSelecting={setIsSelecting} /> : <NotImplemented gearToOrder={gearToOrder} />;
}
