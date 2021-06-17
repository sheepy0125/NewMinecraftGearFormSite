// Title component

import BaseWidget from "./boilerplate/widgets/baseWidget.jsx";

export default function Title(props) {
	return (
		<BaseWidget>
			<div className="font-mono text-3xl text-center">{props.children}</div>
		</BaseWidget>
	);
}
