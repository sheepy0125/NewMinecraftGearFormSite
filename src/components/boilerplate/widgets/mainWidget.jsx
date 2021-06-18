// Main widget class (think of it as a parent widget for other widgets)

import BaseWidget from "./baseWidget";

export default function MainWidget(props) {
	return <BaseWidget className="bg-opacity-25 shadow-lg">{props.children}</BaseWidget>;
}
