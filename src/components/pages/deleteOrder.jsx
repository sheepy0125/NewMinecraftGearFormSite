// Delete order page
// Password screen for deleting a page

import {useState, useEffect, useRef} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {get} from "axios";
import {parse} from "query-string";

import BoxWidget from "../boilerplate/widgets/boxWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import Button from "../boilerplate/button.jsx";

export default function DeleteOrder(props) {
	const history = useHistory();

	const paramsString = useLocation().search;
	const paramsDictionary = parse(paramsString);

	const [orderInformation, setOrderInformation] = useState(null);
	const [deletionResponse, setDeletionResponse] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const pinInput = useRef(null);
	const masterPasswordInput = useRef(null);
	const [useMasterPassword, setUseMasterPassword] = useState(false);

	// Fetch order information
	function fetchOrderInformation() {
		get(`get-order-content?id=${paramsDictionary.id}&minimal=true`)
			.then((resp) => {
				if (!resp.data.worked) throw Error("Failed to get order content"); // Throw error if failed to get order content
				setOrderInformation(resp.data.data);
			})
			.catch((resp) => {
				console.error(resp.message || resp);
				history.push("/api-error");
			});
	}

	// Delete order
	function deleteOrder() {
		const id = paramsDictionary.id;
		const pin = (pinInput.current && pinInput.current.value) || null;
		const masterPassword = (masterPasswordInput.current && masterPasswordInput.current.value) || null;

		let deleteURL;
		if (!useMasterPassword) deleteURL = `delete-order?id=${id}&pin=${pin}`;
		else deleteURL = `delete-order?id=${id}&master-password=${masterPassword}`;

		setIsLoading(true);
		get(deleteURL)
			.then((resp) => {
				setDeletionResponse(resp.data);
			})
			.catch((resp) => {
				console.error(resp.message || resp);
				history.push("/api-error");
			});
	}

	// Reset page
	function resetPage() {
		setUseMasterPassword(null);
		setDeletionResponse(null);
		masterPasswordInput.current = "";
	}

	// Forgot PIN
	function forgotPin() {
		history.push("/not-implemented");
	}

	// Done loading
	useEffect(() => {
		if (deletionResponse === null) return;
		setIsLoading(false);
	}, [deletionResponse]);

	// Fetch order information on load
	useEffect(() => {
		fetchOrderInformation();
	}, []); /* eslint-disable-line */

	return isLoading ? (
		<LoadingWidget />
	) : orderInformation ? (
		<>
			{/* The user needs to enter credentials */}
			{!deletionResponse ? (
				<BoxWidget>
					<div className="font-light mx-auto w-full text-center">
						<p className="font-bold">
							Deleting {orderInformation.username}'s order (ID {orderInformation.order_id}, queue number {orderInformation.queue_number})
						</p>

						{/* The user is using the message password */}
						{useMasterPassword ? (
							<label>
								Master Password <br />
								<input type="text" ref={masterPasswordInput} />
							</label>
						) : (
							// The user is using their PIN
							<label>
								PIN{" "}
								<button className="text-xs" onClick={forgotPin}>
									(forgot)
								</button>
								<br />
								<input type="text" ref={pinInput} />
							</label>
						)}
						<br />
						<label>
							<input
								type="checkbox"
								onClick={() => {
									setUseMasterPassword(!useMasterPassword);
								}}
							/>{" "}
							Use master password
						</label>
						<div onClick={deleteOrder}>
							<Button className="w-full">Delete</Button>
						</div>
						<br />
						<div onClick={() => history.push("/view-all-orders")}>
							<Button className="w-full">Back to view orders page</Button>
						</div>
					</div>
				</BoxWidget>
			) : (
				// The API has responded
				<BoxWidget>
					{/* The deletion worked */}
					{deletionResponse.worked ? (
						<>
							<p className="text-2xl">Order {paramsDictionary.id} has been deleted!</p>
							<div onClick={() => history.push("/view-all-orders")}>
								<Button className="w-full">Back to view orders page</Button>
							</div>
						</>
					) : (
						// Deletion failed
						<div className="font-light">
							<p className="text-2xl">Deleting order failed!</p>
							<p>
								{deletionResponse.message} ({deletionResponse.code})
							</p>
							<div onClick={resetPage}>
								<Button className="w-full">Try again</Button>
							</div>
							<br />
							<div onClick={() => history.push("/view-all-orders")}>
								<Button className="w-full">Back to view orders page</Button>
							</div>
						</div>
					)}
				</BoxWidget>
			)}
		</>
	) : (
		<LoadingWidget />
	);
}
