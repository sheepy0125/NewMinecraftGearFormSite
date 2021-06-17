import {Component} from "react";

export default class Index extends Component {
	componentDidMount = () => {
		console.log("I am here!!");
	};
	render = () => {
		return <p className="container py-2 mx-auto my-2 font-mono text-lg text-center bg-blue-300 shadow-lg">Nothing here yet!</p>;
	};
}
