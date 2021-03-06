// Submit order

import {useHistory} from "react-router-dom";
import {post} from "axios";

import Button from "./boilerplate/button.jsx";
import {error} from "./pages/errors/apiError.jsx";

// Submit
function submit({content, history}) {
	console.log("%cSubmitting order!", "color: white; background-color: purple");
	console.log("The JSON data that's being submitted is:");
	console.log(JSON.stringify(content, null, 4));

	post("api/submit-form", content)
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
					`&orderUsername=${orderUsername}&estimatedCost=${estimatedCost}`
			);
		})
		.catch((resp) => {
			error(resp);
			history.push("/api-error");
		});
}

export default function SubmitOrder(props) {
	const history = useHistory();

	const content = props.content;

	return (
		<div
			onClick={() => {
				submit({content: content, history: history});
				props.onSubmit();
			}}
		>
			<Button>Submit</Button>
		</div>
	);
}
