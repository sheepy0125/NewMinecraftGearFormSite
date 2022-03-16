// Page for editing an order
// For editing the order, just show the formEnchants page but have the items loaded in from the server

import {useState, useEffect} from "react";
import {useLocation, useHistory} from "react-router-dom";
import {parse} from "query-string";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import FormEnchants from "./formEnchants.jsx";
import Form from "./formEdit.jsx";
import {error} from "./errors/apiError.jsx";

export default function EditOrder(props) {
	const history = useHistory();

	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	const [orderContent, setOrderContent] = useState(null);

	function fetchContent() {
		get(`api/get-order-content?id=${paramsDictionary.id}`)
			.then((resp) => {
				if (!resp.data.worked) throw Error(`Failed fetching order content (${resp.data.message}, code ${resp.data.code})`);
				setOrderContent(resp.data.data.content);
			})
			.catch((resp) => {
				error(resp);
				history.push("/api-error");
			});
	}

	useEffect(() => {
		fetchContent();
	}, []); /* eslint-disable-line react-hooks/exhaustive-deps */

	return <Form orderContent={orderContent} />;
}
