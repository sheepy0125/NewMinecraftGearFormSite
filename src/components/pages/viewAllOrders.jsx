// View all orders page

import {useState, useEffect} from "react";
import {useHistory, Link} from "react-router-dom";
import {get} from "axios";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

// Table column
function TableColumn(props) {
	return <td className="flex-1 text-lg text-left bg-white border border-black">{props.children}</td>;
}

// Mobile order row
function OrderRow(props) {
	return <div className="sm:flex">{props.children}</div>;
}
// Mobile order column
function OrderColumn(props) {
	return <div className={`flex-1 bg-white border border-black ${props.title ? "bg-gray-200" : "bg-white font-thin sm:text-left"}`}>{props.children}</div>;
}

// View all orders
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
			<>
				{/* Mobile */}
				<div className="block xl:hidden">
					{ordersData.map((order) => (
						<div key={order.order_id} className="text-sm min-w-max lg:text-base">
							<div className="border border-black">
								<OrderRow>
									<OrderColumn title>Queue number</OrderColumn>
									<OrderColumn>{order.queue_order}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Order ID</OrderColumn>
									<OrderColumn>{order.order_id}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Username</OrderColumn>
									<OrderColumn>{order.username}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Date ordered</OrderColumn>
									<OrderColumn>{order.creation_date}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Date last modified</OrderColumn>
									<OrderColumn>{order.last_modified_date}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Prioritize</OrderColumn>
									<OrderColumn>{order.prioritize ? "Yes" : "No"}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Status</OrderColumn>
									<OrderColumn>{order.status}</OrderColumn>
								</OrderRow>
								<OrderRow>
									<OrderColumn title>Options</OrderColumn>
									<OrderColumn>
										<Link to="/not-implemented" className="text-blue-900 hover:underline">
											View order
										</Link>{" "}
										<Link to="/not-implemented" className="text-blue-900 hover:underline">
											Edit order
										</Link>{" "}
										<Link to="/not-implemented" className="text-blue-900 hover:underline">
											Delete order
										</Link>
									</OrderColumn>
								</OrderRow>
							</div>
							<br />
						</div>
					))}
				</div>
				{/* Desktop */}
				<table className="hidden w-full mx-auto border border-black xl:table">
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
			<BaseWidget className="text-xl text-center">
				<p>Viewing all orders</p>
				{orders ? <BaseWidget>{orders}</BaseWidget> : <LoadingWidget />}
			</BaseWidget>
		</MainWidget>
	);
}
