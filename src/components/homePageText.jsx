// Text for the home / index page

import ListWidget from "./boilerplate/widgets/listWidget.jsx";

export default function HomePageText() {
	return (
		<>
			<div className="text-lg font-normal text-center">
				<p>Hello, and welcome to the website for Sheepy's God Gear Services.</p>
				<p>Here, you can order god gear and view other people's orders.</p>
			</div>
			<br />
			<div>
				<ListWidget>
					<p className="text-center">How much will this cost?</p>
					<li className="font-thin">The materials to make the gear OR the gear already made &amp;</li>
					<li className="font-thin">10 diamonds as a flat rate (profit)</li>
				</ListWidget>
				<ListWidget>
					<p className="text-center">Some things to note</p>
					<li className="font-thin">If you are ordering gear that is NOT diamond, then you must drop it off (iron chestplate, elytra, turtle helmet, etc.)</li>
					<li className="font-thin">
						You may only order up to 5 of an item that costs diamonds to make (e.g. diamond hoe) and 3 of an item that doesn't
						<br />
						cost diamonds to make (e.g. fishing rod)
					</li>
					<li className="font-thin">
						The god gear will be made within 1 week (7 days) of the initial order date. If this fails to happen, you are entitled to your
						<br />
						payment back and an additional 5 diamonds.
					</li>
					<li className="font-thin">There will be no insurance on your god gear.</li>
				</ListWidget>
			</div>
		</>
	);
}
