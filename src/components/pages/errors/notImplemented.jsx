// Not implemented error page

import ErrorWidget from "../../boilerplate/widgets/errorWidget.jsx";
import Button from "../../boilerplate/button.jsx";
import {Link} from "react-router-dom";

export default function NotImplemented() {
	return (
		<ErrorWidget message="This hasn't been implemented.">
			<Link to="/home">
				<Button normalColor="red-300" activeColor="red-400" className="w-full mx-auto">
					Return home
				</Button>
			</Link>
		</ErrorWidget>
	);
}
