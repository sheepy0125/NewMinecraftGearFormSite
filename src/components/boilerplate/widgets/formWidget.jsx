// Form widget

import BaseWidget from "./baseWidget";

export default function FormWidget(props) {
	return (
		<BaseWidget className={`grid-cols-1 gap-2 mx-auto bg-blue-400 lg:grid-cols-3 xl:grid-cols-4 grid ${props.className}`}>{props.children}</BaseWidget>
	);
}
