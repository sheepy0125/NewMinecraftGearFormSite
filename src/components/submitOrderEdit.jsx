// Submit order

import {useRef} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {parse} from "query-string";
import {post} from "axios";

import Button from "./boilerplate/button.jsx";
import {error} from "./pages/errors/apiError.jsx";

// Submit
function submit({content, history, pin, id}) {
	console.log("%cSubmitting order!", "color: white; background-color: purple");
	console.log("The JSON data that's being submitted is:");
	console.log(JSON.stringify(content, null, 4));
	console.log("The PIN is: " + pin);

	post(`api/update-form`, {...content, pin, id})
		.then((resp) => {
			if (!resp.data.worked) throw Error(`Failed to submit order!!! (${resp.data.message}, code ${resp.data.code})`);

			console.log("The order was submitted! Here is the returned data");
			console.log(JSON.stringify(resp.data, null, 4));

			const orderID = resp.data.data.order_id;
			const orderPIN = resp.data.data.order_pin;
			const orderQueueNumber = resp.data.data.order_queue_number;
			const orderUsername = content.general.username;
			const estimatedCost = content.general.estimatedCost;

			// Redirect to submit page
			history.push(
				`/submit-result` +
					`?orderID=${orderID}&orderPIN=${orderPIN}&orderQueueNumber=${orderQueueNumber}` +
					`&orderUsername=${orderUsername}&estimatedCost=${estimatedCost}` +
					`&edit=true`
			);
		})
		.catch((resp) => {
			error(resp);
			history.push("/api-error");
		});
}

export default function SubmitOrderEdit(props) {
	const history = useHistory();
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	const content = props.content;

	const pin = useRef("");

	return (
		<div
			onClick={() => {
				submit({content: content, history: history, pin: pin.current.value, id: paramsDictionary.id});
				props.onSubmit();
			}}
		>
			<Button>Submit</Button>
		</div>
	);
}
