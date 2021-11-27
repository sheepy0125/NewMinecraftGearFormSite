// Handler for selection and enchanting pages combined

import {useState} from "react";

import FormSelection from "./formSelection.jsx";
import FormEnchants from "./formEnchants.jsx";
import GeneralInformation from "./generalInformation.jsx";

export default function Form() {
	const [currentPage, setCurrentPage] = useState(gearSelectionPage());

	// Form pages
	function gearSelectionPage() {
		return <FormSelection nextPage={goToEnchantSelectionPage} />;
	}
	function enchantSelectionPage(content) {
		return (
			<FormEnchants orderNumberDictionary={content.orderNumberDictionary} estimatedCost={content.totalPrice} nextPage={goToGeneralInformationPage} />
		);
	}
	function generalInformationPage(content) {
		return <GeneralInformation content={content} />;
	}

	// Page transitions
	function goToEnchantSelectionPage(content) {
		setCurrentPage(enchantSelectionPage(content));
	}
	function goToGeneralInformationPage(content) {
		setCurrentPage(generalInformationPage(content));
	}

	return currentPage;
}
