// API error page

import {Link} from "react-router-dom";

import BoxWidget from "../../boilerplate/widgets/boxWidget.jsx";
import Button from "../../boilerplate/button.jsx";

export default function ApiError() {
	return (
		<BoxWidget message="There was an error with the API.">
			<div className="text-xl">
				<p className="font-normal">This is probably not good.</p>
			</div>
			<Link to="/home">
				<Button normalColor="red-300" activeColor="red-400" className="w-full mx-auto">
					Return home
				</Button>
			</Link>
		</BoxWidget>
	);
}
