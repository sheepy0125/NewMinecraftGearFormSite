// View all orders page

import {useState, useEffect} from "react";
import {useHistory, Link} from "react-router-dom";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

function TableColumn(props) {
	return <td className="flex-1 text-lg text-left bg-white border border-black">{props.children}</td>;
}

export default function ViewAllOrders() {
	const history = useHistory();

	const [orders, setOrders] = useState(null);

	// Fetch orders
	function fetchOrders() {
		get("view-all-orders")
			.then((resp) => {
				setOrders(convertToHTML(resp.data.data));
			})
			.catch((resp) => {
				history.push("/api-error");
			});
	}

	// Convert to HTML
	function convertToHTML(ordersData) {
		return (
			<table className="w-full mx-auto border border-black">
				<thead>
					<tr className="flex">
						<TableColumn>Queue number</TableColumn>
						<TableColumn>Order ID</TableColumn>
						<TableColumn>Username</TableColumn>
						<TableColumn>Date ordered</TableColumn>
						<TableColumn>Date last modified</TableColumn>
						<TableColumn>Prioritize</TableColumn>
						<TableColumn>Status</TableColumn>
						<TableColumn>Options</TableColumn>
					</tr>
				</thead>

				<tbody>
					{ordersData.map((order) => (
						<tr className="flex font-thin" key={order.order_id}>
							<TableColumn>{order.queue_order}</TableColumn>
							<TableColumn>{order.order_id}</TableColumn>
							<TableColumn>{order.username}</TableColumn>
							<TableColumn>{order.creation_date}</TableColumn>
							<TableColumn>{order.last_modified_date}</TableColumn>
							<TableColumn>{order.prioritize ? "Yes" : "No"}</TableColumn>
							<TableColumn>{order.status}</TableColumn>
							<TableColumn>
								<Link to="/not-implemented" className="block text-blue-900 hover:underline">
									View order
								</Link>
								<Link to="/not-implemented" className="block text-blue-900 hover:underline">
									Edit order
								</Link>
								<Link to="/not-implemented" className="block text-blue-900 hover:underline">
									Delete order
								</Link>
							</TableColumn>
						</tr>
					))}
				</tbody>
			</table>
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
			<BaseWidget className="text-xl text-center">
				<p>Viewing all orders</p>
				{orders ? <BaseWidget>{orders}</BaseWidget> : <LoadingWidget />}
			</BaseWidget>
		</MainWidget>
	);
}
