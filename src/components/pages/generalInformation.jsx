// General information form page

import {useState} from "react";

import MainWidget from "../boilerplate/widgets/mainWidget.jsx";
import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import Title from "../boilerplate/title.jsx";
import Navbar from "../boilerplate/navbar.jsx";
import SubmitOrder from "../submitOrder.jsx";

const usernameMaxLength = 16;
const usernameMinLength = 3;
const additionalMaxLength = 128;

export default function GeneralInformation(props) {
	const [username, setUsername] = useState("");
	const [additional, setAdditional] = useState("");
	const [usernameTooShort, setUsernameTooShort] = useState(true);
	const [prioritize, setPrioritize] = useState(true);

	// Get content
	function getContent(content) {
		return {
			...content,
			general: {
				...content.general,
				username: username,
				additional: additional,
				prioritize: prioritize
			}
		};
	}

	// Username changed
	function usernameChanged(event) {
		const newUsername = event.target.value;

		// Check username
		const usernameTooShortCheck = newUsername.length < usernameMinLength;
		const usernameInvalidCharacterCheck = /[^a-zA-Z0-9_]/.test(newUsername); // Totally not copied off of StackOverflow
		if (usernameInvalidCharacterCheck) return;
		usernameTooShortCheck ? setUsernameTooShort(true) : setUsernameTooShort(false);

		setUsername(newUsername);
	}

	// Additional changed
	function additionalChanged(event) {
		const newAdditional = event.target.value;
		setAdditional(newAdditional);
	}

	// Prioritize checkbox changed
	function prioritizeCheckboxChanged(event) {
		const newChecked = event.target.checked;
		setPrioritize(newChecked);
	}

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Input general information here.</p>
				<BaseWidget className="bg-pink-400">
					<label className="block p-4">
						<p>Username</p>
						<input type="text" value={username} onChange={usernameChanged} minLength={usernameMinLength} maxLength={usernameMaxLength} />
					</label>
					<label className="block p-4">
						<p>Additional information</p>
						<input type="text" value={additional} onChange={additionalChanged} maxLength={additionalMaxLength} />
					</label>
					<label className="block p-4">
						<input type="checkbox" defaultChecked onChange={prioritizeCheckboxChanged} /> Prioritize order (+10 diamonds)
					</label>
					<br />
					{!usernameTooShort ? <SubmitOrder content={getContent(props.content)} /> : <p>Your username isn't valid.</p>}
				</BaseWidget>
			</BaseWidget>
		</MainWidget>
	);
}
