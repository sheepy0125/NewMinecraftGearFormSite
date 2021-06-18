// Button

export default function Button(props) {
	const normalColor = props.active ? props.activeColor : props.normalColor || "blue-300";
	const activeColor = props.activeColor || "blue-700";

	return (
		<button className={`bg-${normalColor} hover:bg-${activeColor} p-2 font-mono hover:underline focus:outline-none ${props.className}`}>
			{props.children}
		</button>
	);
}
