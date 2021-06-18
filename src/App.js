import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";

import Index from "./components/pages/index.jsx";
import FormSelection from "./components/pages/formSelection.jsx";
import PageNotFound from "./components/pages/errors/pageNotFound.jsx";
import NotImplemented from "./components/pages/errors/notImplemented.jsx";

export default function App() {
	return (
		<Router>
			<div className="content">
				<Switch>
					{/* Home page */}
					<Route exact path="/home">
						<Index />
					</Route>

					{/* Home redirect */}
					<Route exact path="/">
						<Redirect to="/home" />
					</Route>

					{/* Form */}
					<Route exact path="/form">
						<FormSelection />
					</Route>

					{/* Not implemented */}
					<Route path="/NotImplemented">
						<NotImplemented />
					</Route>

					{/* 404 */}
					<PageNotFound />
				</Switch>
			</div>
		</Router>
	);
}
