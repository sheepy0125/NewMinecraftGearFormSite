// API error page

import BoxWidget from "../../boilerplate/widgets/boxWidget.jsx";
import Button from "../../boilerplate/button.jsx";
import {Link} from "react-router-dom";

export default function ApiError() {
	return (
		<BoxWidget message="There was an error with the API.">
			<div className="text-xl">
				<p className="font-normal">This is probably not good.</p>
				<p className="font-normal">
					If you weren't trying to break this, please{" "}
					<Link to="/not-implemented" className="text-blue-900 cursor-pointer hover:underline">
						contact Sheepy
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
