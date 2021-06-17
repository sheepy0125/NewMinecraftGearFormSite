// Button

export default function Button(props) {
	return (
		<button
			className={`bg-${props.colorNormal || "blue-300"} hover:bg-${props.colorHover || "blue-700"} p-2 font-mono hover:underline ${props.className}`}
			style={props.style}
		>
			{props.children}
		</button>
	);
}
