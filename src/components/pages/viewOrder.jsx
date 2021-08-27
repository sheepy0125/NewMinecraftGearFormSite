// View order page
// Used to view a specific order

import {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {parse} from "query-string";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import renderFormInputs from "../formInputsViewing.jsx";

export default function ViewOrder() {
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	const [orderContent, setOrderContent] = useState({});
	const [itemInputs, setItemInputs] = useState(null); // Not using a ref here since it won't be changed by user

	// Fetch content
	function fetchContent() {
		get(`get-order-content?id=${paramsDictionary.id}`).then((resp) => {
			setOrderContent(resp.data);
		});
	}

	// When order content changes
	useEffect(() => {
		if (!orderContent.data) return;

		// Convert order content dictionary to a list
		const orderItemList = [];

		for (const item of Object.keys(orderContent.data.content)) {
			if (item === "general") continue;
			orderItemList.push({
				defaultItemName: item,
				itemName: orderContent.data.content[item].name,
				checkboxes: orderContent.data.content[item].enchantments.checkboxes,
				multipleSelection: orderContent.data.content[item].enchantments.multipleSelection,
				additionalInformation: orderContent.data.content[item].additional,
			});
		}

		renderFormInputs({
			setItemInputs: setItemInputs,
			inputList: orderItemList,
		});
	}, [orderContent]); /* eslint-disable-line */

	// Fetch content upon first load
	useEffect(() => {
		fetchContent();
	}, []); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Viewing order {paramsDictionary.id}</Title>
			<Navbar currentPage="/view-all-orders" forceFreshPage={true} />
			<BaseWidget className="text-center text-lg">{itemInputs ? <FormWidget>{itemInputs}</FormWidget> : <LoadingWidget />}</BaseWidget>
		</MainWidget>
	);
}
