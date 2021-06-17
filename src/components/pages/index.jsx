// Index page

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import Title from "../title.jsx";
import Navbar from "../boilerplate/navbar.jsx";

export default function Index() {
	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Home</Title>
			<Navbar currentPage="/home" />
			<BaseWidget className="text-xl text-center">
				<div className="font-light">
					<p>Hello, and welcome to the website for Sheepy's God Gear Services.</p>
					<p>Here, you can order god gear and view other people's orders.</p>
				</div>
				<br />
				<div className="mx-auto max-w-max">
					<ul className="w-full px-8 py-2 font-light text-left list-disc bg-gray-200">
						<p className="font-mono text-center">How much will this cost?</p>
						<li>The materials to make the gear OR the gear already made,</li>
						<li>Five (5) diamonds per elytra, and</li>
						<li>Five (5) diamonds as a flat rate (profit)</li>
					</ul>
					<br />
					<ul className="w-full px-8 py-2 font-light text-left list-disc bg-gray-200">
						<p className="font-mono text-center">Some things to note</p>
						<li>If you are ordering gear that is NOT diamond, then you must drop it off (iron chestplate, turtle helmet, etc.)</li>
						<li>
							You may only order up to five (5) of an item that costs diamonds to make (e.g. diamond hoe) and three (3) of an item that doesn't
							<br />
							cost diamonds to make (e.g. fishing rod)
						</li>
						<li>
							The god gear will be made within one (1) week (7 days) of the initial order date. If this fails to happen, you are entitled to your
							<br />
							payment back and an additional five (5) diamonds.
						</li>
						<li>There will be no insurance on your god gear.</li>
					</ul>
				</div>
			</BaseWidget>
		</MainWidget>
	);
}
