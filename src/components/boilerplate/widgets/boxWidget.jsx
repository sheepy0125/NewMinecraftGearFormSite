// Box widget

import BaseWidget from "./baseWidget.jsx";

export default function BoxWidget(props) {
	return (
		<BaseWidget className={"max-w-max mx-auto lg:mx-auto"}>
			<p className="text-3xl">{props.message}</p>
			{props.children}
		</BaseWidget>
	);
}
