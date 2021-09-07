// Index page

import {useState} from "react";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import ListWidget from "../boilerplate/widgets/listWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Button from "../boilerplate/button.jsx";
import Reviews from "../reviews.jsx";

export default function Index() {
	const [currentTab, setCurrentTab] = useState("information");

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Home</Title>
			<Navbar currentPage="/home" />
			<div className="mx-auto text-lg max-w-max">
				{/* Tab switcher */}
				<ul className="flex mx-4 text-center bg-white sm:mx-8 sm:max-w-max">
					<li className={`sm:flex-auto flex-1 border-r sm:border-r-0 sm:mr-1 cursor-pointer ${currentTab === "information" && "bg-gray-300"}`}>
						<p onClick={() => setCurrentTab("information")}>Information</p>
					</li>
					<li className={`sm:flex-auto flex-1 border-l sm:border-l-0 sm:ml-1 cursor-pointer ${currentTab === "reviews" && "bg-gray-300"}`}>
						<p onClick={() => setCurrentTab("reviews")}>Reviews</p>
					</li>
				</ul>

				<BaseWidget className="my-0 lg:my-0">
					{/* Information tab */}
					{currentTab === "information" && (
						<>
							<div className="text-lg font-normal text-center">
								<p>Hello, and welcome to the website for Sheepy's God Gear Services.</p>
								<p>Here, you can order god gear and view other people's orders.</p>
							</div>
							<br />
							<div>
								<ListWidget>
									<p className="text-center">How much will this cost?</p>
									<li className="font-thin">The materials to make the gear OR the gear already made,</li>
									<li className="font-thin">15 diamonds per elytra, and</li>
									<li className="font-thin">10 diamonds as a flat rate (profit)</li>
								</ListWidget>
								<ListWidget>
									<p className="text-center">Some things to note</p>
									<li className="font-thin">
										If you are ordering gear that is NOT diamond, then you must drop it off (iron chestplate, turtle helmet, etc.)
									</li>
									<li className="font-thin">
										You may only order up to 5 of an item that costs diamonds to make (e.g. diamond hoe) and 3 of an item that doesn't
										<br />
										cost diamonds to make (e.g. fishing rod)
									</li>
									<li className="font-thin">
										The god gear will be made within 1 week (7 days) of the initial order date. If this fails to happen, you are entitled to
										your
										<br />
										payment back and an additional 5 diamonds.
									</li>
									<li className="font-thin">There will be no insurance on your god gear.</li>
								</ListWidget>
							</div>
						</>
					)}

					{/* Reviews tab */}
					{currentTab === "reviews" && <Reviews />}
				</BaseWidget>
			</div>
		</MainWidget>
	);
}
