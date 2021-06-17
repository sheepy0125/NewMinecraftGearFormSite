// Base widget component

export default function Widget(props) {
	return <div className={"p-4 m-4 font-semibold bg-white bg-opacity-50 rounded-lg" + props.className}>{props.children}</div>;
}
