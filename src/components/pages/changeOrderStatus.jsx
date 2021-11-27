// Change order status page

import {useState} from "react";
import {useLocation} from "react-router-dom";
import {parse} from "query-string";

import BaseWidget from "../boilerplate/widgets/baseWidget";
import BoxWidget from "../boilerplate/widgets/boxWidget";
import AuthenticationWidget from "../authentication";

export default function DeleteOrder(props) {
	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	const [status, setStatus] = useState("Received");

	return (
		<>
			<BoxWidget>
				<BaseWidget className="mx-auto lg:mx-auto">
					<p className="mx-auto w-max">New status</p>
					<select
						onChange={(event) => {
							setStatus(event.target.value);
						}}
						className="block mx-auto"
					>
						<option value="Received">Received</option>
						<option value="Gathering enchantments">Gathering enchantments</option>
						<option value="Enchanting">Enchanting</option>
						<option value="Completed">Completed</option>
					</select>
				</BaseWidget>

				<AuthenticationWidget
					id={paramsDictionary.id}
					whatDoingMessage="Changing status for"
					whatDidMessage="changed its status"
					buttonMessage="Change status"
					url="change-order-status"
					allowPIN={false}
					otherParams={`status=${status}`}
				/>
			</BoxWidget>
		</>
	);
}
