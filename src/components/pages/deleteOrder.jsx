// Delete order page
// Password screen for deleting an order

import {useLocation} from "react-router-dom";
import {parse} from "query-string";

import AuthenticationWidget from "../authentication";

export default function DeleteOrder(props) {
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	return (
		<AuthenticationWidget
			id={paramsDictionary.id}
			whatDoingMessage="Deleting"
			whatDidMessage="been deleted"
			buttonMessage="Delete"
			url="delete-order"
			allowPIN
		/>
	);
}
