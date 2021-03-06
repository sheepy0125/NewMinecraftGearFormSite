// Page not found error page

import {Link} from "react-router-dom";

import BoxWidget from "../../boilerplate/widgets/boxWidget.jsx";
import Button from "../../boilerplate/button.jsx";

export default function NotFoundError() {
	return (
		<BoxWidget message="This page doesn't exist!">
			<div className="text-xl">
				<p className="font-normal">Make sure you typed in the address correctly if you entered it manually.</p>
				<p className="font-normal">
					If you believe this to be an error, you may{" "}
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
