// Navbar

import Button from "./button.jsx";
import {Link} from "react-router-dom";
import BaseWidget from "./widgets/baseWidget.jsx";

// Nav item
export function NavItem(props) {
	return (
		<Link to={props.link} className="flex-auto">
			<Button className="flex-auto w-full text-white text-mono" colorNormal="gray-600" colorHover="gray-800">
				{props.children}
			</Button>
		</Link>
	);
}

// Navbar
export default function Navbar() {
	return (
		<BaseWidget>
			<p className="font-mono text-lg text-center">Navigation</p>
			<nav className="flex">
				<NavItem link="/NotImplemented">Home</NavItem>
				<NavItem link="/NotImplemented">Form</NavItem>
				<NavItem link="/NotImplemented">View orders</NavItem>
				<NavItem link="/NotImplemented">Enchantment dictionary</NavItem>
			</nav>
		</BaseWidget>
	);
}
