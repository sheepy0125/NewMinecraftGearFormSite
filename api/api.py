"""
API for god gear ordering site
Created on 06/14/2021
"""

""" Setup """
from flask import Flask
from json import load

api = Flask(__name__, template_folder=None, static_folder="static")

with open("json_files/config.json") as config_file:
	config_dict = load(config_file)

""" Routes """
# Ping
@api.route("/ping", methods=["GET", "POST"])
def ping_route() -> dict[str, bool]:
	return {"worked": True}