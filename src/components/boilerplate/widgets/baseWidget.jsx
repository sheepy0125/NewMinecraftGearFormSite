// Base widget component

export default function BaseWidget(props) {
	const inactiveOpacity = props.inactiveOpacity || "25";
	const activeOpacity = props.activeOpacity || "30";

	return (
		<div
			className={`font-semibold bg-white bg-opacity-${inactiveOpacity} rounded-lg shadow-lg hover:bg-opacity-${activeOpacity} 
						focus-within:bg-opacity-${activeOpacity} p-2 m-2 lg:p-4 lg:m-4 ${props.className}`}
		>
			{props.children}
		</div>
	);
}
