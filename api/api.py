"""
API for god gear ordering site
Created on 06/14/2021
"""

""" Setup """
from flask import Flask, request
from random import randint
from json import load

api: Flask = Flask(__name__, template_folder=None, static_folder="static")

with open("json_files/config.json") as config_file:
	config_dict: dict = load(config_file)

""" Functions """
def send_json_file_as_data(filename: str) -> dict:
	with open(f"json_files/{filename.rsplit('.json')[0]}.json") as json_file:
		json_info: dict = load(json_file)
		return {"worked": True, "data": json_info}

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
@api.route("/get_enchants_for_gear", methods=["GET", "POST"])
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
def submit_route():
	order_id = 1
	order_pin = str(randint(0, 9999)).zfill(4)
	return {"worked": True, "data": {"order_id": order_id, "order_pin": order_pin}}

""" Error handlers """

# All error handlers
@api.errorhandler(Exception)
def error_handler(error):
	try:
		# HTTP error code (error.code works)
		return {"worked": False, "message": "An HTTP exception has occured.", "error_message": str(error), "error_code": error.code}
	except Exception:
		# Internal error
		return {"worked": False, "message": "An internal exception has occurred.", "error_message": str(error)}