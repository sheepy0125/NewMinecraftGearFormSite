// Reviews

import BaseWidget from "./boilerplate/widgets/baseWidget.jsx";
import ListWidget from "./boilerplate/widgets/listWidget.jsx";

function ReviewWidget(props) {
	return <div className="text-sm font-normal text-left border-black md:text-center md:text-lg">{props.children}</div>;
}

export default function Reviews() {
	return (
		<BaseWidget>
			<p className="text-lg font-bold text-center">Reviews</p>
			<ListWidget className="flex md:grid">
				<ReviewWidget>This review is amazing! How great is that!</ReviewWidget>
			</ListWidget>
		</BaseWidget>
	);
}
