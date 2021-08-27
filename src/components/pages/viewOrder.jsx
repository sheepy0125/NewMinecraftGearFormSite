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

	// Not using refs here since it'll only be set once
	const [orderContent, setOrderContent] = useState({});
	const [itemInputs, setItemInputs] = useState(null);
	const [orderDetails, setOrderDetails] = useState(null);

	// Fetch content
	function fetchContent() {
		get(`get-order-content?id=${paramsDictionary.id}`).then((resp) => {
			setOrderContent(resp.data);
		});
	}

	// Render order details
	function renderOrderDetails({details}) {
		return (
			<div className="block w-full px-8 py-4 text-center bg-pink-300 rounded-lg font-light">
				<p>
					ID: <span className="font-bold">{details.orderID}</span>
				</p>
				<p>
					Queue number: <span className="font-bold">{details.queueNumber}</span>
				</p>
				<p>
					Username: <span className="font-bold">{details.username}</span>
				</p>
				<p>
					Date created: <span className="font-bold">{details.creationDate}</span>
				</p>
				<p>
					Date modified: <span className="font-bold">{details.modifiedDate}</span>
				</p>
				<p>
					Prioritize: <span className="font-bold">{details.isPrioritized ? "yes" : "no"}</span>
				</p>
				<p>
					Additional information: <span className="font-bold">{details.additionalInformation}</span>
				</p>
			</div>
		);
	}

	// When order content changes
	useEffect(() => {
		if (!orderContent.data) return;
		console.log(`Recieved data for ${orderContent.data.order_id}!`);
		console.log(JSON.stringify(orderContent.data, null, 4));

		// Order details
		const details = {
			orderID: orderContent.data.order_id,
			queueNumber: orderContent.data.queue_number,
			username: orderContent.data.username,
			creationDate: orderContent.data.date_created,
			modifiedDate: orderContent.data.date_modified,
			isPrioritized: orderContent.data.is_prioritized,
			additionalInformation: "null for now... database doesn't have",
		};
		setOrderDetails(renderOrderDetails({details: details}));

		// Order form

		// Convert order content dictionary to a list
		const orderItemList = [];

		for (const item of Object.keys(orderContent.data.content)) {
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
			<BaseWidget className="text-center text-lg">
				{itemInputs ? (
					<div>
						{orderDetails}
						<FormWidget>{itemInputs}</FormWidget>
					</div>
				) : (
					<LoadingWidget />
				)}
			</BaseWidget>
		</MainWidget>
	);
}
