// Index page

import {useState} from "react";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import Reviews from "../reviews.jsx";
import HomePageText from "../homePageText";

export default function Index() {
	const [currentTab, setCurrentTab] = useState("information");

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Home</Title>
			<Navbar currentPage="/home" />
			<div className="w-full mx-auto text-lg">
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
					{currentTab === "information" && <HomePageText />}

					{/* Reviews tab */}
					{currentTab === "reviews" && <Reviews />}
				</BaseWidget>
			</div>
		</MainWidget>
	);
}
