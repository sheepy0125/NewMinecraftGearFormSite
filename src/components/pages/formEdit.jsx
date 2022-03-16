// Handler for selection and enchanting pages combined

import {useState, useEffect} from "react";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import FormSelection from "./formSelection.jsx";
import FormEnchants from "./formEnchants.jsx";
import GeneralInformation from "./generalInformation.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";

export default function Form(props) {
	const [currentPage, setCurrentPage] = useState(null);

	// Form pages
	function gearSelectionPage() {
		return <FormSelection nextPage={goToEnchantSelectionPage} />;
	}
	function enchantSelectionPage() {
		return <FormEnchants orderContent={props.orderContent} />;
	}
	function generalInformationPage(content) {
		return <GeneralInformation content={content} />;
	}

	// Page transitions
	function goToEnchantSelectionPage(content) {
		setCurrentPage(enchantSelectionPage());
	}
	function goToGeneralInformationPage(content) {
		setCurrentPage(generalInformationPage(content));
	}
	useEffect(() => {
		setCurrentPage(props.orderContent ? enchantSelectionPage() : <LoadingWidget />);
	}, [props.orderContent]);

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form (editing)</Title>
			<Navbar currentPage="/edit-order" />
			{currentPage}
		</MainWidget>
	);
}
