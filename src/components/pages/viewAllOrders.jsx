// View all orders page

import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Hyperlink from "../boilerplate/hyperlink.jsx";
import Button from "../boilerplate/button.jsx";
import {TableColumn, MobileTableColumn, MobileTableRow} from "../boilerplate/table.jsx";

// Options
function Options(props) {
	return (
		<>
			<Hyperlink href={`/view-order?id=${props.id}`}>View order</Hyperlink>
			{/* <Hyperlink href={`/not-implemented?id=${props.id}`}>Edit order</Hyperlink> */}
			<Hyperlink href={`/delete-order?id=${props.id}`}>Delete order</Hyperlink>
		</>
	);
}

// Show order column
function showOrderColumn(columnName) {
	// If it is a boolean type, show y/n
	return typeof columnName !== "boolean" ? columnName : columnName ? "Yes" : "No";
}

// View all orders
export default function ViewAllOrders() {
	const history = useHistory();

	const [orders, setOrders] = useState(null);

	// Fetch orders
	function fetchOrders() {
		get("api/view-all-orders")
			.then((resp) => {
				setOrders(convertToHTML(resp.data.data));
			})
			.catch((resp) => {
				history.push("/api-error");
			});
	}

	// Convert to HTML
	function convertToHTML(ordersData) {
		const columns = [
			{name: "Queue number", valueName: "queue_number"},
			{name: "ID", valueName: "order_id"},
			{name: "Username", valueName: "username"},
			{name: "Creation date", valueName: "date_created"},
			{name: "Last modified date", valueName: "date_modified"},
			{name: "Prioritize", valueName: "is_prioritized"},
			{name: "Status", valueName: "status"},
		];

		return (
			<>
				{/* Mobile */}
				<div className="block xl:hidden">
					{ordersData.map((order, orderID) => (
						<div key={order.order_id} className="text-sm lg:text-base">
							<div className="border border-black">
								{columns.map((row) => (
									<MobileTableRow key={`${row.name} mobile`}>
										<MobileTableColumn title>{row.name}</MobileTableColumn>
										<MobileTableColumn>{showOrderColumn(order[row.valueName])}</MobileTableColumn>
									</MobileTableRow>
								))}
								<MobileTableRow>
									<MobileTableColumn title>Options</MobileTableColumn>
									<MobileTableColumn>
										<Options id={order.order_id} />
									</MobileTableColumn>
								</MobileTableRow>
							</div>

							{/* Line break to show difference between orders */}
							{/* Don't show on last order though */}
							{orderID < ordersData.length - 1 && <br />}
						</div>
					))}
				</div>
				{/* Desktop */}
				<table className="hidden w-full mx-auto border border-black xl:table">
					<thead>
						<tr className="flex">
							{columns.map((row) => (
								<TableColumn key={`${row.name} desktop`}>{row.name}</TableColumn>
							))}
							<TableColumn>Options</TableColumn>
						</tr>
					</thead>

					<tbody>
						{ordersData.map((order) => (
							<tr className="flex font-thin" key={order.order_id}>
								{columns.map((row) => (
									<TableColumn key={row.valueName}>{showOrderColumn(order[row.valueName])}</TableColumn>
								))}
								<TableColumn>
									<Options id={order.order_id} />
								</TableColumn>
							</tr>
						))}
					</tbody>
				</table>
			</>
		);
	}

	// Fetch orders on first load
	useEffect(() => {
		fetchOrders();
	}, []); /* eslint-disable-line */

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - View all orders</Title>
			<Navbar currentPage="/view-all-orders" />
			<BaseWidget className="text-center text-lg">
				<p>Viewing all orders</p>
				{orders ? <>{orders}</> : <LoadingWidget />}
				<br />
				<Button>
					<a href="/api/view-all-orders">Get this in JSON form</a>
				</Button>
			</BaseWidget>
		</MainWidget>
	);
}
