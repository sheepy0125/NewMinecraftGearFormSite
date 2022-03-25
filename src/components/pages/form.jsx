// Handler for selection and enchanting pages combined

import {useState, useEffect, useRef} from "react";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import FormSelection from "./formSelection.jsx";
import FormEnchants from "./formEnchants.jsx";
import GeneralInformation from "./generalInformation.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import SubmitOrder from "../submitOrder.jsx";

export default function Form(props) {
	const [currentPage, setCurrentPage] = useState(null);
	const saveData = useRef({selectPage: {}, enchantPage: {}, generalInfoPage: {}});

	// Form pages
	function gearSelectionPage() {
		return <FormSelection nextPage={goToEnchantSelectionPage} saveData={saveData} />;
	}
	function enchantSelectionPage() {
		return (
			<FormEnchants
				orderNumberDictionary={saveData.current.selectPage.orderNumberDictionary || {}}
				orderContent={(saveData.enchantPage && saveData.enchantPage.orderContent) || props.orderContent}
				nextPage={goToGeneralInformationPage}
				prevPage={goToGearSelectionPage}
				saveData={saveData}
			/>
		);
	}
	function generalInformationPage() {
		return (
			<GeneralInformation
				content={saveData.current.enchantPage.orderContent}
				prevPage={goToEnchantSelectionPage}
				saveData={saveData}
				SubmitOrder={SubmitOrder} // Component
			/>
		);
	}

	// Page transitions
	function goToGearSelectionPage() {
		setCurrentPage(gearSelectionPage());
	}
	function goToEnchantSelectionPage() {
		setCurrentPage(enchantSelectionPage());
	}
	function goToGeneralInformationPage() {
		setCurrentPage(generalInformationPage());
	}

	useEffect(() => {
		setCurrentPage(gearSelectionPage());
	}, []);

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			{currentPage || <LoadingWidget />}
		</MainWidget>
	);
}
