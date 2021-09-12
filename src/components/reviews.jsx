// Reviews

import {useState, useEffect, useRef} from "react";
import {useHistory} from "react-router-dom";
import {get} from "axios";

import BaseWidget from "./boilerplate/widgets/baseWidget.jsx";
import LoadingWidget from "./boilerplate/widgets/loadingWidget.jsx";
import Button from "./boilerplate/button.jsx";

function ReviewWidget(props) {
	return (
		<div className="block w-full px-8 py-4 text-sm font-normal text-left bg-white border border-black lg:rounded-lg">
			<div className="w-full overflow-y-auto break-words border-pink-600 lg:border">
				<p className="text-left max-h-28 lg:h-28 sm:text-center lg:text-left">{props.children}</p>
				<p className="text-left truncate sm:text-center lg:text-right">-{props.authorUsername}</p>
			</div>
			<p className="text-sm font-thin text-center text-gray-500 md:text-base">
				review {props.reviewID} ⋅ {props.ratingOutOfTen / 2}/5 stars <br />
				created on {props.dateCreated.split(" at ")[0]} {/* Leave out the time */}
			</p>
		</div>
	);
}

export default function Reviews() {
	const history = useHistory();

	const [reviews, setReviews] = useState(null);
	const [reviewWidgetsHTML, setReviewWidgetsHTML] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [canLoadMore, setCanLoadMore] = useState(true);

	const reviewIDPaginateBy = 5;
	const reviewIDRange = useRef([1, reviewIDPaginateBy]);

	function fetchReviews() {
		/* There is actually a problem with this.
		 * Every time the user switches to the review tab, it fetches the reviews again.
		 * We need to have the reviews saved in between tab switches
		 * But don't get the reviews until the user switches to the reviews tab!
		 *
		 * Possible solutions:
		 * 1. save reviews in index.jsx
		 * 2. store reviews in local/session storage temporarily
		 * 3. save review widgets only so to not rerender them, and just don't fetch the reviews anymore
		 *
		 * but for now, i'm too lazy to do it, so just writing this for later
		 */
		get(`/get-reviews?starting_id=${reviewIDRange.current[0]}&ending_id=${reviewIDRange.current[1]}`)
			.then((resp) => {
				setReviews(resp.data.reviews);
				setCanLoadMore(resp.data.can_load_more);
				setIsLoading(false);
			})
			.catch((resp) => {
				console.error(resp.message || resp);
				history.push("/api-error");
			});
	}

	// Set review widgets HTML
	useEffect(() => {
		// If no reviews yet, don't bother
		if (!reviews) return;

		setReviewWidgetsHTML((oldReviewWidgetsHTML) => [
			...oldReviewWidgetsHTML,
			reviews.map((review) => (
				<ReviewWidget
					authorUsername={review.username}
					ratingOutOfTen={review.rating_out_of_ten}
					reviewID={review.post_id}
					dateCreated={review.date_created}
					key={`Review ${review.post_id}`}
				>
					{review.content}
				</ReviewWidget>
			)),
		]);
	}, [reviews]);

	// Fetch reviews on load
	useEffect(() => {
		fetchReviews();
	}, []); /* eslint-disable-line */

	return (
		<BaseWidget>
			<p className="text-lg font-bold text-center">Reviews</p>
			{isLoading ? (
				<LoadingWidget />
			) : (
				<>
					{reviews.length > 0 ? (
						<>
							<BaseWidget className={`grid-cols-1 gap-2 mx-auto bg-white lg:grid-cols-2 xl:grid-cols-3 grid`}>{reviewWidgetsHTML}</BaseWidget>
							{canLoadMore ? (
								<div
									onClick={() => {
										const currentReviewIDRange = reviewIDRange.current;
										reviewIDRange.current = [currentReviewIDRange[0] + reviewIDPaginateBy, currentReviewIDRange[1] + reviewIDPaginateBy];
										fetchReviews();
									}}
								>
									<Button className="w-full mx-4">Load more</Button>
								</div>
							) : (
								<p className="text-sm text-center text-gray-500">looks like you've reached the end</p>
							)}
						</>
					) : (
						<p className="text-sm text-center text-gray-500">nothing here</p>
					)}
				</>
			)}
		</BaseWidget>
	);
}
