"""
API dev tools
Created on 03/09/2021 (dd/mm/yyyy)
"""

""" Setup """

from api import database, Orders, Reviews, send_json_file_as_data, get_current_time, get_random_pin, update_queue_numbers_for_other_orders, \
				update_ids_for_other_orders, get_new_queue_number, delete_order, submit_order, get_all_orders
from api_dev_tools_boilerplate import BaseWindow
from tkinter import Text, Entry, END

""" Main window class """
class MainWindow(BaseWindow):
	def __init__(self) -> None:
		super().__init__(win_size=(800, 600), win_resizable=False, win_title="API Dev Tools")

	""" Pages """

	# Menu page
	def menu(self) -> None:
		self.reset_win()
		self.label("API Dev Tools").pack(pady=8)
		self.button("View all orders", on_click=lambda: self.view_all_orders_page()).pack(pady=8)
		self.button("Delete order", on_click=lambda: self.delete_order_page()).pack(pady=8)
		self.button("Submit order", on_click=lambda: self.submit_order_page()).pack(pady=8)
		self.button("Quit", on_click=lambda: self.exit_win()).pack(pady=8)
		self.main_loop()

	# View order page
	def view_all_orders_page(self) -> None:
		self.reset_win()

		# Get all orders
		all_orders: list = get_all_orders()
		
		# Formatted nicely
		all_orders_text_formatted: Text = self.text(rows=10)
		all_orders_text_formatted.insert("1.0", "All orders (formatted)\n")
		for order in all_orders:
			all_orders_text_formatted.insert(
				END,
				f"\nID: {order['order_id']} | QUEUE NUMBER: {order['queue_number']} | USERNAME: {order['username']} | "
				f"DATE_CREATED: {order['date_created']} | STATUS: {order['status']} | ADDITIONAL INFORMATION: {order['additional_information']}"
			)
		all_orders_text_formatted.config(state="disabled")
		all_orders_text_formatted.config(wrap="none")

		# Raw JSON
		all_orders_text_raw: Text = self.text(rows=10)
		all_orders_text_raw.insert("1.0", "All orders (raw)\n")
		for order in all_orders:
			all_orders_text_raw.insert(
				END,
				f"\n{order}"
			)
		all_orders_text_raw.config(state="disabled")

		self.label("Viewing all orders").pack(pady=8)
		all_orders_text_formatted.pack(pady=8)
		all_orders_text_raw.pack(pady=8)
		self.button("Back to menu", on_click=lambda: self.menu()).pack(pady=8)
		self.main_loop()

	# Delete order page
	def delete_order_page(self) -> None:
		# Run delete order command
		def run_delete_order():
			try:
				order_id: int = int(order_id_entry.get())
				delete_order(order_id)
				StatusWindow(f"Successfully deleted order with ID {order_id}.")

			except Exception as exception:
				error_handling(exception)

		self.reset_win()
		self.label("Deleting order").pack(pady=8)
		self.label("Order ID").pack(pady=2)
		order_id_entry: Entry = self.entry(width=(self.widget_size[0] // 3))
		order_id_entry.pack()
		self.button("Delete order", on_click=lambda: run_delete_order()).pack(pady=8)
		self.button("Back to menu", on_click=lambda: self.menu()).pack(pady=8)
		self.main_loop()

	# Submit order page
	def submit_order_page(self) -> None:
		# Run submit order command
		def run_submit_order():
			try:
				true, false, null = True, False, None # JSON vs Python dictionaries!
				order_json: dict = eval(json_input_text.get("1.0", END)) # Sure, using eval() isn't the best, but I don't feel like importing the JSON module
				submission_result: dict = submit_order(order_json)
				StatusWindow(f"Successfully submitted order. Data returned: {submission_result}")

			except Exception as exception:
				error_handling(exception)
		
		self.reset_win()
		self.label("Submit order with raw JSON").pack(pady=8)
		json_input_text: Text = self.text(rows=10)
		json_input_text.pack(pady=8)
		self.button("Submit order", on_click=lambda: run_submit_order()).pack(pady=8)
		self.button("Back to menu", on_click=lambda: self.menu()).pack(pady=8)
		self.main_loop()

""" Status window class """
class StatusWindow(BaseWindow):
	def __init__(self, text: str) -> None:
		super().__init__(win_size=(250, 150), win_resizable=False, win_title="Status")
		self.show_message(text)

	# Show message
	def show_message(self, text: str) -> None:
		status_text: Text = self.text(rows=4)
		status_text.insert("1.0", text)
		status_text.pack(pady=8)
		self.button("OK", on_click=lambda: self.exit_win()).pack(pady=8)
		self.main_loop()

""" Functions """

# Exception handling
def error_handling(exception=None):
	error_formatted: str = "unknown error" if exception is None else f"{type(exception).__name__}: {exception}"
	StatusWindow(f"An error occurred: {error_formatted}")

MainWindow().menu()