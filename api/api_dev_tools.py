"""
API dev tools
Created on 03/09/2021 (dd/mm/yyyy)
"""

from api import (
    database,
    Orders,
    Reviews,
    delete_order,
    submit_order,
    get_all_orders,
    delete_review,
    submit_review,
    get_all_reviews,
    ORDERS_DB_PATH,
    REVIEWS_DB_PATH,
)
from api_dev_tools_boilerplate import BaseWindow
from tkinter import Text, Entry, END
from os import remove
from json import loads


class MainWindow(BaseWindow):
    def __init__(self) -> None:
        super().__init__(
            win_size=(800, 600), win_resizable=False, win_title="API Dev Tools"
        )

    ### Pages ###

    # Menu page
    def menu(self) -> None:
        self.reset_win()
        self.label("API Dev Tools").pack(pady=8)
        self.label("Orders").pack(pady=8)
        self.button(
            "View all orders", on_click=lambda: self.view_all_rows_page(table="orders")
        ).pack(pady=8)
        self.button(
            "Delete order", on_click=lambda: self.delete_row_page(table="orders")
        ).pack(pady=8)
        self.button(
            "Submit order", on_click=lambda: self.submit_row_page(table="orders")
        ).pack(pady=8)
        self.button(
            "Reset / create new orders table",
            on_click=lambda: reset_table(table_path=ORDERS_DB_PATH, table="orders_db"),
        ).pack(pady=8)
        self.label("Reviews").pack(pady=8)
        self.button(
            "View all reviews",
            on_click=lambda: self.view_all_rows_page(table="reviews"),
        ).pack(pady=8)
        self.button(
            "Delete review", on_click=lambda: self.delete_row_page(table="reviews")
        ).pack(pady=8)
        self.button(
            "Submit review", on_click=lambda: self.submit_row_page(table="reviews")
        ).pack(pady=8)
        self.button(
            "Reset / create new reviews table",
            on_click=lambda: reset_table(
                table_path=REVIEWS_DB_PATH, table="reviews_db"
            ),
        ).pack(pady=8)
        self.button("Quit", on_click=lambda: self.exit_win()).pack(pady=8)
        self.main_loop()

    # View all rows of table
    def view_all_rows_page(self, table: str):
        self.reset_win()

        all_rows: list = eval(f"get_all_{table}()")

        all_rows_text: Text = self.text(rows=10)
        all_rows_text.insert("1.0", f"All {table} (raw)\n")
        for row in all_rows:
            all_rows_text.insert(END, f"\n{row},")
        all_rows_text.config(state="disabled")

        self.label(f"Viewing all {table}").pack(pady=8)
        all_rows_text.pack(pady=8)
        self.button("Back to menu", on_click=lambda: self.menu()).pack(pady=8)
        self.main_loop()

    # Delete row page
    def delete_row_page(self, table: str) -> None:
        table: str = table.rsplit("s")[0]

        # Run delete row command
        def run_delete_row():
            try:
                row_id: int = int(row_id_entry.get())
                eval(f"delete_{table}(row_id)")
                StatusWindow(f"Successfully deleted {table} with ID {row_id}.")

            except Exception as exception:
                error_handling(exception)

        self.reset_win()
        self.label(f"Deleting {table}").pack(pady=8)
        self.label(f"{''.join([table[0].upper(), table[1::]])} ID").pack(pady=2)
        row_id_entry: Entry = self.entry(width=(self.widget_size[0] // 3))
        row_id_entry.pack()
        self.button(f"Delete {table}", on_click=lambda: run_delete_row()).pack(pady=8)
        self.button("Back to menu", on_click=lambda: self.menu()).pack(pady=8)
        self.main_loop()

    # Submit row page
    def submit_row_page(self, table: str) -> None:
        table: str = table.rsplit("s")[0]

        # Run submit row command
        def run_submit_row() -> None:
            try:
                row_json = loads(json_input_text.get("1.0", END))  # NOSONAR (S1481)
                submission_result: dict = eval(f"submit_{table}(row_json)")
                StatusWindow(
                    f"Successfully submitted {table}. Data returned: {submission_result}"
                )

            except Exception as exception:
                error_handling(exception)

        self.reset_win()
        self.label(f"Submit {table} with raw JSON").pack(pady=8)
        json_input_text: Text = self.text(rows=10)
        json_input_text.pack(pady=8)
        self.button(f"Submit {table}", on_click=lambda: run_submit_row()).pack(pady=8)
        self.button("Back to menu", on_click=lambda: self.menu()).pack(pady=8)
        self.main_loop()


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


### Functions ###


def reset_table(table_path: str, table: str) -> None:
    """Reset a table with error handling"""

    # Attempt to remove table
    try:
        remove(table_path)

    # Didn't work, file doesn't exist
    except FileNotFoundError:
        pass

    # Another exception
    except Exception as exception:
        error_handling(exception)

    try:
        # Create table
        database.create_all(bind=table)
        database.session.commit()

        # Status
        StatusWindow("Successfully reset database!")

    except Exception as exception:
        error_handling(exception)


def error_handling(exception=None) -> StatusWindow:
    """Print the error nicely"""

    error_formatted: str = (
        "unknown error"
        if exception is None
        else f"{type(exception).__name__}: {exception}"
    )
    return StatusWindow(f"An error occurred: {error_formatted}")


MainWindow().menu()
