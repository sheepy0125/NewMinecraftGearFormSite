"""
API for god gear ordering site
Created on 06/14/2021
"""

""" Setup """
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from random import randint
from json import load
from datetime import datetime
from pytz import timezone

with open("json_files/config.json") as config_file:
	config_dict: dict = load(config_file)

api: Flask = Flask(__name__, template_folder=None, static_folder="static")
# api.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///database/order.db" # Production
api.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///database/test.db" # Testing
api.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
database: SQLAlchemy = SQLAlchemy(api)

""" Database """
class Orders(database.Model):
	order_id = database.Column(database.Integer, primary_key=True)
	username = database.Column(database.String(16), nullable=False)
	content = database.Column(database.PickleType, nullable=False)
	creation_date = database.Column(database.DateTime, nullable=False)
	last_modified_date = database.Column(database.DateTime, nullable=False)
	prioritize = database.Column(database.Boolean, nullable=False)
	queue_order = database.Column(database.Integer, nullable=False)
	status = database.Column(database.String(32), nullable=False)
	pin = database.Column(database.String(4), nullable=False)


""" Functions """
# Send JSON file as data
def send_json_file_as_data(filename: str) -> dict:
	with open(f"json_files/{filename.rsplit('.json')[0]}.json") as json_file:
		json_info: dict = load(json_file)
		return {"worked": True, "data": json_info}

# Get random pin
def get_random_pin() -> str:
	return str(randint(0, 9999)).zfill(4)

# Get queue order
def get_order_queue_order(prioritize: bool) -> int:
	# Get all orders
	all_orders_list: list = view_all_orders_route()["data"]

	# If no orders, just return 1
	if len(all_orders_list) == 0:
		return 1

	prioritized_orders_list: list = []
	unprioritized_orders_list: list = []

	# Iterate through each order
	for order in all_orders_list:
		# Add to respective list
		if order["prioritize"]: prioritized_orders_list.append(order)
		else: unprioritized_orders_list.append(order)

	# If prioritizing
	if prioritize:
		# Set the queue order to be the number of prioritized orders + 1
		queue_order: int = len(prioritized_orders_list) + 1

		# Now we will have to go through all unprioritized orders and modify their queue order
		for order_json in unprioritized_orders_list:
			order: Orders = Orders.query.filter_by(order_id=order_json["order_id"]).first()
			order.queue_order += 1
			print(f"Updated order queue for id of {order_json['order_id']}")

		# Only commit if there were other orders
		if len(unprioritized_orders_list) > 0:
			print("Commiting changes")
			database.session.commit()

	# Not prioritizing
	else:
		# Set the queue order to be just the number of orders + 1
		queue_order: int = len(all_orders_list) + 1

	return queue_order

""" Routes """
# Ping
@api.route("/ping", methods=["GET"])
def ping_route() -> dict:
	return {"worked": True}

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

		return {"worked": True, "data": {"sorted_list": maintaining_order_selected_gear_items, "enchant_dict": enchant_dict}}

# Submit
@api.route("/submit", methods=["POST"])
def submit_route() -> dict:
	ordered_json = request.json

	order_username: str = ordered_json["general"]["username"]
	order_prioritize: bool = ordered_json["general"]["prioritize"]	
	ordered_content_dict: dict = ordered_json; del ordered_content_dict["general"]
	order_pin: str = get_random_pin()
	order_queue_order: int = get_order_queue_order(prioritize=order_prioritize)

	tz = timezone("US/Eastern"); creation_date = datetime.now(); creation_date = creation_date.replace(tzinfo = tz); creation_date = creation_date.astimezone(tz) # Get time in ET

	order_submission = Orders(
		username=order_username,
		content=ordered_content_dict,
		pin=order_pin, creation_date=creation_date,
		last_modified_date=creation_date,
		queue_order=order_queue_order,
		prioritize=order_prioritize,
		status="Recieved"
	)

	database.session.add(order_submission)
	database.session.commit()

	return {"worked": True, "data": {"order_id": order_submission.order_id, "order_pin": order_pin}}

# View all orders
@api.route("/view-all-orders", methods=["GET"])
def view_all_orders_route() -> dict:
	allowed_columns: tuple = (Orders.order_id, Orders.username, Orders.creation_date, Orders.last_modified_date, Orders.prioritize, Orders.queue_order, Orders.status) # Don't show unneeded columns
	all_orders = Orders.query.order_by(Orders.creation_date).with_entities(*allowed_columns).all()
	all_orders_list: list = [(dict(row)) for row in all_orders] # Convert rows to list of dicts
	
	return {"worked": True, "data": all_orders_list}

""" Error handlers """

# All error handlers
@api.errorhandler(Exception)
def error_handler(error) -> dict:
	try:
		# HTTP error code (error.code works)
		return {"worked": False, "message": "An HTTP exception has occured.", "error_message": str(error), "error_code": error.code}
	except Exception:
		# Internal error
		return {"worked": False, "message": "An internal exception has occurred.", "error_message": str(error)}