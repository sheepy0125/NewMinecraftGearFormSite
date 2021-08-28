// Box widget

import BaseWidget from "./baseWidget.jsx";

export default function BoxWidget(props) {
	return (
		<BaseWidget className={"max-w-max m-4 xl:mx-auto" /* responsive design classes take priority */}>
			<p className="text-3xl">{props.message}</p>
			{props.children}
		</BaseWidget>
	);
}
