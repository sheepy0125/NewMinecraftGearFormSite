// Authentication widget
// Used for authenticating when doing something with an order

import {useState, useEffect, useRef} from "react";
import {useHistory} from "react-router-dom";
import {get} from "axios";

import BoxWidget from "./boilerplate/widgets/boxWidget.jsx";
import LoadingWidget from "./boilerplate/widgets/loadingWidget.jsx";
import Button from "./boilerplate/button.jsx";
import {error} from "./pages/errors/apiError.jsx";

export default function AuthenticationWidget(props) {
	const history = useHistory();

	const [orderInformation, setOrderInformation] = useState(null);
	const [authResponse, setAuthResponse] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const pinInput = useRef(null);
	const masterPasswordInput = useRef(null);
	const [useMasterPassword, setUseMasterPassword] = useState(!props.allowPIN);

	function fetchOrderInformation() {
		get(`api/get-order-content?id=${props.id}&minimal=true`)
			.then((resp) => {
				if (!resp.data.worked) throw Error(`Failed to fetch order content for authentication (${resp.data.message}, code ${resp.data.code})`);
				setOrderInformation(resp.data.data);
			})
			.catch((resp) => {
				error(resp);
				history.push("/api-error");
			});
	}

	function resetPage() {
		setUseMasterPassword(false);
		setAuthResponse(null);
		masterPasswordInput.current = "";
	}

	function authAttempt() {
		setIsLoading(true);

		const id = props.id;
		const pin = (pinInput.current && pinInput.current.value) || null;
		const password = (masterPasswordInput.current && masterPasswordInput.current.value) || null;

		let url = useMasterPassword ? `${props.url}?id=${id}&password=${password}` : `${props.url}?id=${id}&pin=${pin}`;
		props.otherParams && (url += `&${props.otherParams}`);

		get(`api/${url}`)
			.then((resp) => {
				setAuthResponse(resp.data);
			})
			.catch((resp) => {
				error(Error(`Failed to get response from auth attempt (${resp.message})`));
				history.push("/api-error");
			});
	}

	function forgotPin() {
		history.push("/not-implemented");
	}

	// Authentication response changed
	useEffect(() => {
		if (!authResponse) return;

		setIsLoading(false);
	}, [authResponse]);

	useEffect(() => {
		fetchOrderInformation();
	}, []); /* eslint-disable-line */

	return isLoading ? (
		<LoadingWidget />
	) : orderInformation ? (
		<>
			{!authResponse ? (
				<BoxWidget>
					<div className="w-full mx-auto font-light text-center">
						<p className="font-bold">
							{props.whatDoingMessage} {orderInformation.username}'s order (ID {orderInformation.order_id}, queue number{" "}
							{orderInformation.queue_number})
						</p>

						{useMasterPassword ? (
							<label>
								Master Password <br />
								<input type="text" ref={masterPasswordInput} />
							</label>
						) : (
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
						{props.allowPIN && (
							<label>
								<input
									type="checkbox"
									onClick={() => {
										setUseMasterPassword(!useMasterPassword);
									}}
								/>{" "}
								Use master password
							</label>
						)}
						<div onClick={authAttempt}>
							<Button className="w-full">{props.buttonMessage}</Button>
						</div>
						<br />
						<div onClick={() => history.push("/view-all-orders")}>
							<Button className="w-full">Back to view orders page</Button>
						</div>
					</div>
				</BoxWidget>
			) : (
				<BoxWidget>
					{authResponse.worked ? (
						<>
							<p className="text-2xl">
								Order {props.id} has successfully {props.whatDidMessage}!
							</p>
							<div onClick={() => history.push("/view-all-orders")}>
								<Button className="w-full">Back to view orders page</Button>
							</div>
						</>
					) : (
						<div className="font-light">
							<p className="text-2xl">{props.whatDoingMessage} failed!</p>
							<p>
								{authResponse.message} ({authResponse.code})
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
