// API error page

import {Link} from "react-router-dom";

import BoxWidget from "../../boilerplate/widgets/boxWidget.jsx";
import Button from "../../boilerplate/button.jsx";

export function error(exception) {
	console.log(exception);
	console.error("An API error has occurred!");
	localStorage.setItem("error", exception.message);
	localStorage.setItem("error-time", Date.now());
	console.error(localStorage.getItem("error"));
}

export default function ApiError() {
	return (
		<BoxWidget message="There was an error with the API.">
			<div className="text-xl">
				<p className="font-normal">This is probably not good.</p>
				<p className="font-normal">Error: {localStorage.getItem("error") || "(none)"}</p>
				<p className="text-sm font-normal">Error cached from {(Date.now() - localStorage.getItem("error-time")) / 1000} seconds ago</p>
			</div>
			<Link to="/home">
				<Button normalColor="red-300" activeColor="red-400" className="w-full mx-auto">
					Return home
				</Button>
			</Link>
		</BoxWidget>
	);
}
