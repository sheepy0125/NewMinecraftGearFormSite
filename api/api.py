"""
API for god gear ordering site
Created on 06/14/2021
"""

""" Setup """
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from random import randint
from json import load
from time import strftime

with open("json_files/config.json") as config_file:
	config_dict: dict = load(config_file)
	MASTER_PASSWORD = config_dict["masterPassword"]

api: Flask = Flask(__name__, template_folder=None, static_folder="static")
# api.config["SQLALCHEMY_DATABASE_URI"]: str = f"sqlite:///database/order.db" # Production
api.config["SQLALCHEMY_DATABASE_URI"]: str = f"sqlite:///database/test.db" # Testing
api.config["SQLALCHEMY_TRACK_MODIFICATIONS"]: bool = False # Honestly, no idea what this does, but it removes the warning
api.config["JSON_SORT_KEYS"]: bool = False
database: SQLAlchemy = SQLAlchemy(api)

""" Database """

class Orders(database.Model):
	order_id = database.Column(database.Integer, primary_key=True)
	username = database.Column(database.String(16), nullable=False)
	content = database.Column(database.PickleType, nullable=False)
	additional_information = database.Column(database.String(128), nullable=False)
	date_created = database.Column(database.String(50), nullable=False)
	date_modified = database.Column(database.String(50), nullable=False)
	is_prioritized = database.Column(database.Boolean, nullable=False)
	queue_number = database.Column(database.Integer, nullable=False)
	status = database.Column(database.String(32), nullable=False)
	pin = database.Column(database.String(4), nullable=False)

VIEW_ALL_ORDERS_COLUMNS: tuple = (
	Orders.order_id,
	Orders.username,
	Orders.additional_information,
	Orders.date_created,
	Orders.date_modified,
	Orders.is_prioritized,
	Orders.queue_number,
	Orders.status
	# Missing columns: [content, pin]
)

GET_ORDER_CONTENT_COLUMNS: tuple = (
	*VIEW_ALL_ORDERS_COLUMNS, # TODO: d
	Orders.content
	# Missing columns: [pin]
)

class Reviews:
	post_id = database.Column(database.Integer, primary_key=True)
	username = database.Column(database.String(16), nullable=False)
	content = database.Column(database.String(500), nullable=False)
	date_created = database.Column(database.String(50), nullable=False)
	rating_out_of_ten = database.Column(databse.Integer, nullable=False)

""" Functions """
# Send JSON file as data
def send_json_file_as_data(filename: str) -> dict:
	with open(f"json_files/{filename.rsplit('.json')[0]}.json") as json_file:
		json_info: dict = load(json_file)
		return {"worked": True, "data": json_info, "code": 200}

# Get current time
def get_current_time() -> str:
	# Example output: "Monday, July 05 2021 at 09:00:48 PM Eastern"
	# %A = Day of week, %B = Month, %d = Day of month, %Y = Year, %I = Hour (24 hour time), %M = Minute, %S = Second, %p = AM or PM
	return strftime("%A, %B %d %Y at %I:%M:%S %p Eastern")

# Get random pin
def get_random_pin() -> str:
	return str(randint(0, 9999)).zfill(4)

# Update queue numbers for other orders
def update_queue_numbers_for_other_orders(starting_queue_number: int, change_by: int=1) -> None:
	# Get all the orders that need to be changed
	try: all_orders_need_change: Orders = Orders.query.filter(Orders.queue_number >= starting_queue_number).all()

	# No orders need to be changed, time to quit! (AttributeError: 'NoneType' object has no attribute 'queue_number')
	except AttributeError: return

	for order_need_change in all_orders_need_change:
		order_need_change.queue_number += change_by

	# Commit changes (if any)
	if len(all_orders_need_change) > 0:
		database.session.commit()

# Update IDs for other orders
def update_ids_for_other_orders(starting_id: int, change_by: int=1) -> None:
	# Get all the orders that need to be changed
	try: all_orders_need_change: Orders = Orders.query.filter(Orders.order_id >= starting_id).all()

	# No orders need to be changed, time to quit! (AttributeError: 'NoneType' object has no attribute 'order_id')
	except AttributeError: return

	for order_need_change in all_orders_need_change:
		order_need_change.order_id += change_by

	# Commit changes (if any)
	if len(all_orders_need_change) > 0:
		database.session.commit()

# Get new queue number
def get_new_queue_number(prioritize: bool) -> int:
	# If there are no orders, then we can just return 1
	if Orders.query.count() == 0: return 1

	if prioritize:
		# The queue number will be the first order that isn't prioritizing
		try: return Orders.query.filter_by(is_prioritized=False).first().queue_number

		# An attribute error will occur when there are no orders that aren't needed to be prioritized
		except AttributeError: pass

	# The queue number will be the last position
	return Orders.query.count() + 1

""" Routes """
# Ping
@api.route("/ping", methods=["GET"])
def ping_route() -> dict:
	return {"worked": True, "code": 200}

# Get select dictionary
@api.route("/get_select_dictionary", methods=["GET"])
def get_selection_dictionary() -> dict:
	return send_json_file_as_data("form_select_dictionary")

# Get all enchantments for selected gear
@api.route("/get_enchants_for_gear", methods=["POST"])
def get_enchants_for_gear() -> dict:
	with open("json_files/gear_enchant_dictionary.json") as all_gear_enchants_file:
		all_gear_enchants_info: dict = load(all_gear_enchants_file)
		selected_gear_items: list = request.json

		# Right now, the selected_gear_items list is sorted alphabetically. I want to keep the order that I want the gear to be in (like Sword, Pickaxe, Shovel...).
		# There probably is a better way but this is fine for now. (potential TODO: do it in a better way?)

		maintaining_order_selected_gear_items: list = []
		all_gear_items: list = list(all_gear_enchants_info.keys()) # This is in the correct order.

		# For each item, if it is in the selected items list, append it to the maintaining order list
		for item_index in range(len(all_gear_items)):
			item: str = all_gear_items[item_index]
			if item in selected_gear_items:
				maintaining_order_selected_gear_items.append(item)

		# Get enchantment dictionary
		enchant_dict: dict = {}
		for item in maintaining_order_selected_gear_items:
			enchant_dict[item] = {
				"checkboxes": all_gear_enchants_info[item]["checkboxes"],
				"multipleSelection": all_gear_enchants_info[item]["multipleSelection"]
			}

		return {"worked": True, "data": {"sorted_list": maintaining_order_selected_gear_items, "enchant_dict": enchant_dict}, "code": 200}

""" Form routes """

# Submit
@api.route("/submit", methods=["POST"])
def submit_route() -> dict:
	ordered_json: dict = request.json

	order_username: str = ordered_json["general"]["username"]
	order_prioritize: bool = ordered_json["general"]["prioritize"]
	order_additional_information: str = ordered_json["general"]["additional"]
	ordered_content_dict: dict = ordered_json; del ordered_content_dict["general"]
	order_pin: str = get_random_pin()
	order_queue_number: int = get_new_queue_number(prioritize=order_prioritize)
	date_created: str = get_current_time()

	# Update other queue numbers
	update_queue_numbers_for_other_orders(starting_queue_number=order_queue_number, change_by=1)

	# Create order
	order_submission: Orders = Orders(
		username=order_username,
		content=ordered_content_dict,
		additional_information=order_additional_information,
		pin=order_pin,
		date_created=date_created,
		date_modified="N/A",
		queue_number=order_queue_number,
		is_prioritized=order_prioritize,
		status="Recieved" # TODO: change from str to int value from 1-4 & have it in the config file in a list?
	)
	# Save to database!
	database.session.add(order_submission)
	database.session.commit()

	return {"worked": True, "data": {"order_id": order_submission.order_id, "order_pin": order_pin, "order_queue_number": order_queue_number}, "code": 200}

# View all orders
@api.route("/view-all-orders", methods=["GET"])
def view_all_orders_route() -> dict:
	all_orders: Orders = Orders.query.order_by(Orders.queue_number).with_entities(*VIEW_ALL_ORDERS_COLUMNS).all()
	all_orders_list: list = [(dict(row)) for row in all_orders] # Convert rows to list of dicts

	return {"worked": True, "data": all_orders_list, "code": 200}

# Get order content
@api.route("/get-order-content", methods=["GET"])
def get_order_content_route() -> dict:
	order_id: int = int(request.args["id"])

	# If the user wishes to get minimal information
	# Use case: getting information for deleting order
	minimal: bool = not not request.args.get("minimal")
	if minimal: get_order_content_columns: tuple = (Orders.order_id, Orders.queue_number, Orders.username)
	else: get_order_content_columns: tuple = GET_ORDER_CONTENT_COLUMNS

	order_content: dict = dict(Orders.query.filter_by(order_id=order_id).with_entities(*get_order_content_columns).first())
	return {"worked": True, "data": order_content, "code": 200}

# Delete order
@api.route("/delete-order", methods=["GET"])
def delete_order_route() -> dict:
	# Get order ID and password / pin
	order_id: int = int(request.args["id"])

	# User supplied pin, compare
	if (user_supplied_master_password := request.args.get("master-password")) is None:
		user_supplied_pin: str = request.args["pin"]
		# Compare pins
		order_pin: str = Orders.query.filter_by(order_id=order_id).first().pin
		if user_supplied_pin != order_pin:
			return {"worked": False, "message": "The pin isn't correct!", "code": 403}
	
	# User supplied master password, compare
	else:
		# Easter egg
		if user_supplied_master_password == "LaCraftyIsSmelly":
			return {"worked": False, "message": "The password you've entered is the truth.", "code": 403}

		# Compare the super secure master passwords /s
		if user_supplied_master_password != MASTER_PASSWORD:
			return {"worked": False, "message": "The master password isn't correct!", "code": 403}

	# Finish
	order: Order = Orders.query.filter_by(order_id=order_id).first()
	order_queue_number: int = order.queue_number

	# We need to update the other order's queue numbers and IDs
	# In order to prevent collisions with matching IDs and queue numbers, we should just set them to an arbitrary unique number
	order.order_id = order.queue_number = randint(1000, 1500)
	database.session.commit()

	# Now update the orders
	update_queue_numbers_for_other_orders(starting_queue_number=order_queue_number, change_by=-1)
	update_ids_for_other_orders(starting_id=order_id, change_by=-1)

	# After that's all done, we can finally delete the order.
	database.session.delete(order)
	database.session.commit()
	
	return {"worked": True, "message": "The order has successfully been deleted.", "code": 200}

""" Reviews route """

# Submit review
@api.route("/submit-review", methods=["POST"])
def submit_review_route() -> dict:
	review_json: dict = {}

	review_username: str = review_json["username"]
	review_rating: int = review_json["rating"]
	review_content: str = review_json["content"]
	date_created: str = get_current_time()

	# Create review
	review_submission: Reviews = Reviews(
		username=review_username
		content=review_content
		rating_out_of_ten=review_rating
		date_created=date_created
	)
	# Save to database!
	database.session.add(review_submission)
	database.session.commit()

	return {"worked": True, code: 200}

# Get reviews
@api.route("/get-reviews", methods=["GET"])
def get_reviews_route() -> dict:
	starting_id: int = int(request.args["starting_id"])
	ending_id: int = int(request.args["ending_id"])

	all_reviews: Reviews = Reviews.query.order_by(Reviews.queue_number).filter(ending_id >= Reviews.post_id >= starting_id).all()
	all_reviews_list: list = [(dict(row)) for row in all_reviews] # Convert rows to list of dicts

	return {"worked": True, "reviews": all_reviews_list, "code": 200}

""" Error handlers """

# All error handlers
@api.errorhandler(Exception)
def error_handler(error: Exception) -> dict:
	try:
		# HTTP error code (error.code works)
		return {"worked": False, "message": "An HTTP exception has occured.", "error_message": str(error), "code": error.code}
	except Exception:
		# Internal error
		return {"worked": False, "message": "An internal exception has occurred.", "error_message": str(error)}