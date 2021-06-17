// Main widget class (think of it as a parent widget for other widgets)

import BaseWidget from "./baseWidget";

export default function MainWidget(props) {
	return <BaseWidget className="block bg-gray-200 bg-opacity-25 shadow-lg flex-cols">{props.children}</BaseWidget>;
}
