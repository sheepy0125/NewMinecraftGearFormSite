// View order page
// Used to view a specific order

import {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {parse} from "query-string";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import FormWidget from "../boilerplate/widgets/formWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Button from "../boilerplate/button.jsx";
import renderFormInputs from "../formInputsViewing.jsx";

export default function ViewOrder() {
	const history = useHistory();
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	// Not using refs here since it'll only be set once
	const [orderContent, setOrderContent] = useState({});
	const [itemInputs, setItemInputs] = useState(null);
	const [orderDetails, setOrderDetails] = useState(null);

	// Fetch content
	function fetchContent() {
		get(`api/get-order-content?id=${paramsDictionary.id}`)
			.then((resp) => {
				if (!resp.data.worked) throw Error("Failed to get order content"); // Throw error if failed to get order content
				setOrderContent(resp.data.data);
			})
			.catch((resp) => {
				console.error(resp.message);
				history.push("/api-error");
			});
	}

	// Render order details
	function renderOrderDetails({details}) {
		return (
			<div className="block mx-4 font-light bg-blue-300 rounded-lg">
				<p>ID: {details.orderID}</p>
				<p>Queue number: {details.queueNumber}</p>
				<p>Username: {details.username}</p>
				<p>Discord username: {details.discord}</p>
				<p>Prioritize: {details.isPrioritized ? "yes" : "no"}</p>
				<p>Date created: {details.creationDate}</p>
				<p>Date modified: {details.modifiedDate}</p>
				<br />
				<label>
					Deliver to
					<br />
					<input type="text" value={details.deliverTo} readOnly />
				</label>
				<br />
				<br />
				<label>
					Additional information
					<br />
					<input type="text" value={details.additionalInformation} readOnly />
				</label>
			</div>
		);
	}

	// When order content changes
	useEffect(() => {
		if (!orderContent.content) return;

		// Order details
		const details = {
			orderID: orderContent.order_id,
			queueNumber: orderContent.queue_number,
			username: orderContent.username,
			discord: orderContent.discord,
			creationDate: orderContent.date_created,
			modifiedDate: orderContent.date_modified,
			isPrioritized: orderContent.is_prioritized,
			additionalInformation: orderContent.additional_information,
			deliverTo: orderContent.deliver_to,
		};

		// Do the HTML stuffs for the order details stuffs
		setOrderDetails(renderOrderDetails({details: details}));

		// Order form

		// Convert order content dictionary to a list
		const orderItemList = [];

		for (const item of Object.keys(orderContent.content)) {
			orderItemList.push({
				defaultItemName: item,
				itemName: orderContent.content[item].name,
				checkboxes: orderContent.content[item].enchantments.checkboxes,
				multipleSelection: orderContent.content[item].enchantments.multipleSelection,
				additionalInformation: orderContent.content[item].additional,
			});
		}

		// Do more of the HTML stuffs, this time for the form
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
			<BaseWidget className="text-lg text-center">
				{itemInputs ? (
					<div>
						{orderDetails}
						<FormWidget>{itemInputs}</FormWidget>
					</div>
				) : (
					<LoadingWidget />
				)}
				<Button>
					<a href={`/api/get-order-content?id=${paramsDictionary.id}`}>Get this in JSON form</a>
				</Button>
			</BaseWidget>
		</MainWidget>
	);
}
