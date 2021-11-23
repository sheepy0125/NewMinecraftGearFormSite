// Table boilerplate

// Table column
export function TableColumn(props) {
	return <td className="flex-1 text-lg text-left bg-white border border-black">{props.children}</td>;
}

// Mobile table row
export function MobileTableRow(props) {
	return <div className="break-words sm:flex">{props.children}</div>;
}
// Mobile table column
export function MobileTableColumn(props) {
	return <div className={`flex-1 bg-white border border-black ${props.title ? "bg-gray-200" : "bg-white font-thin sm:text-left"}`}>{props.children}</div>;
}
