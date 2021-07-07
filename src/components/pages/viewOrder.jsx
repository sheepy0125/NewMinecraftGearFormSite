// View order page

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
import FormElements from "../formElements.jsx";

export default function ViewOrder() {
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);
	const history = useHistory();

	const [itemInputs, setItemInputs] = useState(null); // Not using a ref here since it won't be changed by user

	// Fetch content
	function fetchContent() {
		get(`get-order-content?id=${paramsDictionary.id}`)
			.then((resp) => {
				setItemInputs(convertToHTML(resp.data.data));
			})
			.catch((resp) => {
				history.push("/api-error");
			});
	}

	// Convert content to HTML
	function convertToHTML(content) {
		return;
	}

	// Fetch content upon first load
	useEffect(() => {
		fetchContent();
	}, []); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Viewing order {paramsDictionary.id}</Title>
			<Navbar currentPage="/view-all-orders" />
			<BaseWidget className="text-center text-lg">{itemInputs ? <FormWidget>{itemInputs}</FormWidget> : <LoadingWidget />}</BaseWidget>
		</MainWidget>
	);
}
