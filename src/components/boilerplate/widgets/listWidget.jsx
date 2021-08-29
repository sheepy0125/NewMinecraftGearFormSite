// List widget

import BaseWidget from "./baseWidget.jsx";

export default function ListWidget(props) {
	return (
		<BaseWidget className={`lg:px-8 lg:py-2 text-left list-disc bg-gray-200 ${props.className}`} activeOpacity="80" inactiveOpacity="70">
			{props.children}
		</BaseWidget>
	);
}
