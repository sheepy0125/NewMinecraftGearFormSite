from api import database, Orders

def delete_orders(start, end=None):
	if end == None:
		end = start

	for order_id in range(start, end + 1):
		database.session.delete(Orders.query.filter_by(order_id=order_id).first())
		print(f"Deleted order {order_id}")

	database.session.commit()
	print(f"Done deleting orders with {start=} and {end=}") 

while True:
	choice = input("Pick a choice!\n[D]elete orders\n>")
	choice_lower = choice.lower()
	if choice_lower == "d":
		range_input = input("Pick a start and an end for IDs to delete seperated by a space (e.g. \"1 2\")\n>")
		range_seperated = [int(str_number) for str_number in range_input.split(" ")]
		delete_orders(range_seperated[0], range_seperated[1])