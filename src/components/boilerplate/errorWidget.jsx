// Error widget

import Widget from "./widget.jsx";

export default function ErrorWidget(props) {
	return (
		<Widget className="block mx-auto max-w-max">
			<p className="font-mono text-3xl">{props.message}</p>
			{props.children}
		</Widget>
	);
}
