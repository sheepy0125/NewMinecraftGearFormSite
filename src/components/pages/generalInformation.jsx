// General information form page

import {useState} from "react";

import BaseWidget from "../boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "../boilerplate/widgets/loadingWidget.jsx";
import SubmitOrder from "../submitOrder.jsx";

// I don't know why I felt the need to declare constants here
const usernameMaxLength = 16;
const usernameMinLength = 3;
const additionalMaxLength = 128;
const discordMaxLength = 36;
const deliverToMaxLength = 128;

export default function GeneralInformation(props) {
	const [username, setUsername] = useState("");
	const [additional, setAdditional] = useState("");
	const [usernameTooShort, setUsernameTooShort] = useState(true);
	const [discord, setDiscord] = useState("");
	const [deliverTo, setDeliverTo] = useState("");

	const [isPrioritized, setIsPrioritized] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function getContent(content) {
		return {
			...content,
			general: {
				...content.general,
				username: username,
				additional: additional,
				discord: discord,
				deliver_to: deliverTo,
				prioritize: isPrioritized,
			},
		};
	}

	function usernameChanged(event) {
		const newUsername = event.target.value;

		// Check username
		const usernameTooShortCheck = newUsername.length < usernameMinLength;
		const usernameInvalidCharacterCheck = /[\W]/.test(newUsername);
		if (usernameInvalidCharacterCheck) return;
		usernameTooShortCheck ? setUsernameTooShort(true) : setUsernameTooShort(false);

		setUsername(newUsername);
	}

	function discordChanged(event) {
		const newDiscord = event.target.value;
		setDiscord(newDiscord);
	}

	function additionalChanged(event) {
		const newAdditional = event.target.value;
		setAdditional(newAdditional);
	}

	function deliverToChanged(event) {
		const newDeliverTo = event.target.value;
		setDeliverTo(newDeliverTo);
	}

	function prioritizeCheckboxChanged(event) {
		const newChecked = event.target.checked;
		setIsPrioritized(newChecked);
	}

	return (
		<BaseWidget className="text-xl text-center">
			<p className="font-semibold">Form</p>
			{!isSubmitting ? (
				<>
					<p className="font-thin">Input general information here.</p>
					<BaseWidget className="bg-blue-400">
						<label className="block p-4">
							<p>Username</p>
							<input type="text" value={username} onChange={usernameChanged} minLength={usernameMinLength} maxLength={usernameMaxLength} />
						</label>
						<label className="block p-4">
							<p>Discord username</p>
							<input type="text" value={discord} onChange={discordChanged} maxLength={discordMaxLength} />
						</label>
						<p className="text-xs font-thin">
							Please include both your Discord username and the discriminator (4 numbers).
							<br />
							If you don't know this, it's okay to leave it blank.
						</p>
						<label className="block p-4">
							<p>Additional information</p>
							<input type="text" value={additional} onChange={additionalChanged} maxLength={additionalMaxLength} />
						</label>
						<label className="block p-4">
							<p>Deliver to</p>
							<input type="text" value={deliverTo} onChange={deliverToChanged} maxLength={deliverToMaxLength} />
						</label>
						<label className="block p-4">
							<input type="checkbox" defaultChecked onChange={prioritizeCheckboxChanged} /> Prioritize order (+10 diamonds)
						</label>
						<br />
						{!usernameTooShort ? (
							<props.SubmitOrder content={getContent(props.content)} onSubmit={() => setIsSubmitting(true)} />
						) : (
							<p>Your username isn't valid.</p>
						)}
					</BaseWidget>
				</>
			) : (
				<LoadingWidget />
			)}
		</BaseWidget>
	);
}
