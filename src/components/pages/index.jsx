// Index page

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import ListWidget from "../boilerplate/widgets/listWidget.jsx";
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
				<div className="mx-auto text-lg max-w-max">
					<ListWidget>
						<p className="text-xl text-center">How much will this cost?</p>
						<li className="font-normal">The materials to make the gear OR the gear already made,</li>
						<li className="font-normal">15 diamonds per elytra, and</li>
						<li className="font-normal">5 diamonds as a flat rate (profit)</li>
					</ListWidget>
					<ListWidget>
						<p className="text-center ">Some things to note</p>
						<li className="font-normal">
							If you are ordering gear that is NOT diamond, then you must drop it off (iron chestplate, turtle helmet, etc.)
						</li>
						<li className="font-normal">
							You may only order up to 5 of an item that costs diamonds to make (e.g. diamond hoe) and 3 of an item that doesn't
							<br />
							cost diamonds to make (e.g. fishing rod)
						</li>
						<li className="font-normal">
							The god gear will be made within 1 week (7 days) of the initial order date. If this fails to happen, you are entitled to your
							<br />
							payment back and an additional 5 diamonds.
						</li>
						<li className="font-normal">There will be no insurance on your god gear.</li>
					</ListWidget>
				</div>
			</BaseWidget>
		</MainWidget>
	);
}
