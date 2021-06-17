// Button

export default function Button(props) {
	return (
		<button
			className={"bg-" + (props.colorNormal || "blue-300") + " hover:bg-" + (props.colorHover || "blue-700") + " m-2 p-2 font-mono " + props.className}
		>
			{props.children}
		</button>
	);
}
