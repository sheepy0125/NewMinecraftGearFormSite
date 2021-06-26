// Title component

import BaseWidget from "./widgets/baseWidget.jsx";

export default function Title(props) {
	return (
		<BaseWidget>
			<div className="text-3xl text-center">{props.children}</div>
		</BaseWidget>
	);
}
