"""
API for god gear ordering site
Created on 06/14/2021
"""

""" Setup """
from flask import Flask
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