// Hyperlink

import {Link} from "react-router-dom";

export default function Hyperlink(props) {
	return (
		<Link to={props.href} className={`block text-blue-900 hover:underline ${props.className}`}>
			{props.children}
		</Link>
	);
}
