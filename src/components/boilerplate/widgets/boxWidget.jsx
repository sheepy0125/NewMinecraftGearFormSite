// Box widget

import BaseWidget from "./baseWidget.jsx";

export default function BoxWidget(props) {
	return (
		<BaseWidget className="block mx-auto max-w-max">
			<p className="text-3xl ">{props.message}</p>
			{props.children}
		</BaseWidget>
	);
}
