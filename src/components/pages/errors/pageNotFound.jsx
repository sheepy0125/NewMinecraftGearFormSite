// 404: Page not found error page

import ErrorWidget from "../../boilerplate/errorWidget.jsx";
import Button from "../../boilerplate/button.jsx";
import {Link} from "react-router-dom";

export default function NotFoundError() {
	return (
		<ErrorWidget message="This page doesn't exist!">
			<p className="font-thin">Make sure you typed in the address correctly if you entered it manually.</p>
			<p className="font-thin">
				If you believe this to be an error, you may{" "}
				<Link to="/NotImplemented" className="text-blue-900 cursor-pointer hover:underline">
					contact Sheepy
				</Link>
				.
			</p>
			<Button colorNormal="red-300" colorHover="red-400" className="w-full mx-auto">
				<Link to="/home">Return home</Link>
			</Button>
		</ErrorWidget>
	);
}
