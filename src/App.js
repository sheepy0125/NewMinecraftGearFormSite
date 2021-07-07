import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import {lazy, Suspense} from "react";

import LoadingWidget from "./components/boilerplate/widgets/loadingWidget.jsx";

const LazyIndex = lazy(() => import("./components/pages/index.jsx"));
const LazyForm = lazy(() => import("./components/pages/form.jsx"));
const LazySubmitResult = lazy(() => import("./components/pages/submitResult.jsx"));
const LazyApiError = lazy(() => import("./components/pages/errors/apiError.jsx"));
const LazyViewAllOrdersPage = lazy(() => import("./components/pages/viewAllOrders.jsx"));
const LazyViewOrderPage = lazy(() => import("./components/pages/viewOrder.jsx"));
const LazyPageNotFound = lazy(() => import("./components/pages/errors/pageNotFound.jsx"));
const LazyNotImplemented = lazy(() => import("./components/pages/errors/notImplemented.jsx"));

export default function App() {
	return (
		<Router>
			<Suspense fallback={<LoadingWidget />}>
				<Switch>
					{/* Home page */}
					<Route exact path="/home">
						<LazyIndex />
					</Route>

					{/* Home redirect */}
					<Route exact path="/">
						<Redirect to="/home" />
					</Route>

					{/* Form */}
					<Route exact path="/form">
						<LazyForm />
					</Route>

					{/* Submit result */}
					<Route path="/submit-result">
						<LazySubmitResult />
					</Route>

					{/* API error */}
					<Route path="/api-error">
						<LazyApiError />
					</Route>

					{/* View all orders */}
					<Route path="/view-all-orders">
						<LazyViewAllOrdersPage />
					</Route>

					{/* View order */}
					<Route path="/view-order">
						<LazyViewOrderPage />
					</Route>

					{/* Not implemented */}
					<Route path="/not-implemented">
						<LazyNotImplemented />
					</Route>

					{/* 404 */}
					<LazyPageNotFound />
				</Switch>
			</Suspense>
		</Router>
	);
}
