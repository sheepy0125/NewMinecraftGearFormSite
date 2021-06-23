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
	const [usernameValid, setUsernameValid] = useState(false);

	// Get content
	function getContent(content) {
		return {
			...content,
			general: {
				username: username,
				additional: additional
			}
		};
	}

	// Username changed
	function usernameChanged(event) {
		const newUsername = event.target.value;

		// Check username
		const usernameTooLong = newUsername.length > usernameMaxLength;
		const usernameTooShort = newUsername.length < usernameMinLength;
		const usernameContainsSpace = /\s+$/.test(newUsername); // Totally not copied off of StackOverflow
		if (usernameTooShort) setUsernameValid(false);
		if (usernameTooLong || usernameTooShort || usernameContainsSpace) {
			// If username contains space or is too long then don't update the username
			if (usernameTooLong || usernameContainsSpace) return;
		} else setUsernameValid(true);

		setUsername(newUsername);
	}

	// Additional changed
	function additionalChanged(event) {
		const newAdditional = event.target.value;

		// Check additional
		const additionalTooLong = newAdditional.length > additionalMaxLength;
		if (additionalTooLong) return;
		else setUsernameValid(true);

		setAdditional(newAdditional);
	}

	return (
		<MainWidget>
			<Title>Sheepy's God Gear Services - Form</Title>
			<Navbar currentPage="/form" />
			<BaseWidget className="text-xl text-center">
				<p className="font-semibold">Form</p>
				<p className="font-thin">Input general information here.</p>
				<BaseWidget>
					<label className="block p-4">
						<p>Username</p>
						<input type="text" value={username} onChange={usernameChanged} maxLength={usernameMaxLength} minLength={usernameMinLength} />
					</label>
					<label className="block p-4">
						<p>Additional information</p>
						<input type="text" value={additional} onChange={additionalChanged} maxLength={additionalMaxLength} />
					</label>
					<br />
					{usernameValid ? <SubmitOrder content={getContent(props.content)} /> : <p>Your username isn't valid.</p>}
				</BaseWidget>
			</BaseWidget>
		</MainWidget>
	);
}
