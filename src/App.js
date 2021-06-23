import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import {lazy, Suspense} from "react";

import LoadingWidget from "./components/boilerplate/widgets/loadingWidget.jsx";

const LazyIndex = lazy(() => import("./components/pages/index.jsx"));
const LazyForm = lazy(() => import("./components/pages/form.jsx"));
const LazySubmitResult = lazy(() => import("./components/pages/submitResult.jsx"));
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
					<Route path="/submitResult">
						<LazySubmitResult />
					</Route>

					{/* Not implemented */}
					<Route path="/NotImplemented">
						<LazyNotImplemented />
					</Route>

					{/* 404 */}
					<LazyPageNotFound />
				</Switch>
			</Suspense>
		</Router>
	);
}
