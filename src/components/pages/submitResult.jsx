// Submit result page

import {useLocation, Link} from "react-router-dom";
import {parse} from "query-string";

import BoxWidget from "../boilerplate/widgets/boxWidget.jsx";
import Button from "../boilerplate/button.jsx";

export default function SubmitResult() {
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	console.log(paramsDictionary);

	return (
		<BoxWidget message={`Your order (id ${paramsDictionary.orderID}) has been submitted.`}>
			<div className="text-xl">
				<p className="text-2xl">Your order's queue number is {paramsDictionary.orderQueueNumber}</p>
				<p className="font-normal">Please drop off your payment at Sheepy's base.</p>
				<p className="font-normal">
					The estimated cost of your order is {paramsDictionary.estimatedCost} diamonds. Head over to{" "}
					<Link to="/not-implemented" className="text-blue-900 cursor-pointer hover:underline">
						the calculator
					</Link>{" "}
					for the actual price.
				</p>
				<p className="font-normal">If you want to edit or remove your order, your PIN is {paramsDictionary.orderPIN}.</p>
				<p className="font-normal">
					You can view it{" "}
					<Link to="/not-implemented" className="text-blue-900 cursor-pointer hover:underline">
						here
					</Link>
					.
				</p>
			</div>
			<Link to="/home">
				<Button normalColor="red-300" activeColor="red-400" className="w-full mx-auto">
					Return home
				</Button>
			</Link>
		</BoxWidget>
	);
}
