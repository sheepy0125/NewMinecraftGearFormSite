"""
Boilerplate stuff for the API
Created on 09/03/2021 (dd/mm/yyyy)
"""

from tkinter import Tk, Label, Button, Text, Entry
from typing import Union, Callable


class BaseWindow:
    def __init__(
        self,
        win_size: tuple = (300, 300),
        win_resizable: bool = False,
        win_title: str = "Unnamed window",
        widget_size: Union[tuple, None] = None,
    ) -> None:
        self.win_size: tuple = win_size
        self.win_resizable: bool = win_resizable
        self.win_title: str = win_title
        self.widget_size: tuple = widget_size or ((self.win_size[0] // 10), 2)

        # Create Tkinter win
        self.root: Tk = Tk()
        self.root.title(self.win_title)
        self.root.geometry(f"{self.win_size[0]}x{self.win_size[1]}")
        self.root.resizable(width=self.win_resizable, height=self.win_resizable)

    # Reset Tkinter
    def reset_win(self):
        self.root.destroy()
        self.__init__()  # self here is the child class

    # Exit
    def exit_win(self):
        self.root.quit()
        self.root.destroy()

    # Main loop
    def main_loop(self):
        self.root.mainloop()

    """ Shortcuts """

    def label(self, text: str) -> Label:
        return Label(
            master=self.root,
            text=text,
            width=self.widget_size[0],
            height=self.widget_size[1],
        )

    def button(self, text: str, on_click: Callable) -> Button:
        return Button(
            master=self.root,
            text=text,
            command=on_click,
            width=self.widget_size[0],
            height=self.widget_size[1],
        )

    def text(self, state: Union[str, None] = None, rows: int = 2):
        return Text(
            master=self.root, state=state, width=self.widget_size[0], height=rows
        )

    def entry(self, width: Union[int, None] = None):
        return Entry(master=self.root, width=(width or self.widget_size[0]))
