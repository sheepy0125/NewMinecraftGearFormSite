// Submit order

import {post} from "axios";
import {useHistory} from "react-router";

import Button from "./boilerplate/button.jsx";

// Submit
function submit({content, history}) {
	post("/submit", content).then((resp) => {
		console.log(resp.data);

		const orderID = resp.data.data.order_id;
		const orderPIN = resp.data.data.order_pin;
		const orderUsername = content.general.username;

		// Redirect to submit page
		history.push(`/submitResult?orderID=${orderID}&orderPIN=${orderPIN}&orderUsername=${orderUsername}`);
	});
}

// Submit order render
export default function SubmitOrder(props) {
	let history = useHistory();
	const content = props.content;

	return (
		<div onClick={() => submit({content: content, history: history})}>
			<Button>Submit</Button>
		</div>
	);
}
