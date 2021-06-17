// Navbar

import Button from "./button.jsx";
import {Link} from "react-router-dom";
import BaseWidget from "./widgets/baseWidget.jsx";

// Nav item
const NavItem = (props) => {
	const isUserOnPage = props.currentPage === props.link;

	const activeColor = "gray-800";
	const normalColor = "gray-600";
	return (
		<Link to={props.link} className="flex-1">
			<Button className="flex-auto w-full text-white text-mono" normalColor={normalColor} activeColor={activeColor} active={isUserOnPage}>
				{props.children}
			</Button>
		</Link>
	);
};

// Navbar
export default function Navbar(props) {
	const currentPage = props.currentPage;

	return (
		<BaseWidget>
			<p className="font-mono text-lg text-center">Navigation</p>
			<nav className="flex">
				<NavItem currentPage={currentPage} link="/home">
					Home
				</NavItem>
				<NavItem currentPage={currentPage} link="/form">
					Form
				</NavItem>
				<NavItem currentPage={currentPage} link="/NotImplemented">
					View orders
				</NavItem>
				<NavItem currentPage={currentPage} link="/NotImplemented">
					Enchantment dictionary
				</NavItem>
			</nav>
		</BaseWidget>
	);
}
