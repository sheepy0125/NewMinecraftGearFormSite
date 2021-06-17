// Not implemented error page

import ErrorWidget from "../../boilerplate/errorWidget.jsx";
import Button from "../../boilerplate/button.jsx";
import {Link} from "react-router-dom";

export default function NotImplemented() {
	return (
		<ErrorWidget message="This hasn't been implemented.">
			<Button colorNormal="red-300" colorHover="red-400" className="w-full mx-auto">
				<Link to="/home">Return home</Link>
			</Button>
		</ErrorWidget>
	);
}
