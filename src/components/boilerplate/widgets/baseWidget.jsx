// Base widget component

export default function BaseWidget(props) {
	const inactiveOpacity = props.inactiveOpacity || "25";
	const activeOpacity = props.activeOpacity || "30";

	return (
		<div
			className={`p-4 m-4 font-semibold bg-white bg-opacity-${inactiveOpacity} rounded-lg shadow-lg hover:bg-opacity-${activeOpacity} focus-within:bg-opacity-${activeOpacity} ${props.className}`}
		>
			{props.children}
		</div>
	);
}
