# Spreadsheets

This application provides a collaborative browser-based spreadsheets-client.

> [!WARNING]
> This application is still in development. Sudden data loss can occur at any time. Please make backups of your data directory!

![](./public/demo.png)

## Setup

- required nodejs and npm to be installed
- navigate to project directory
- run `npm install` to install dependencies

## Starting

- run `npm run start` to start frontend and backend together
- to start only the frontend, run `npm run dev`
- and for only the backend, run `node server.js`

## Manual

### Navigation, Formatting and Selecting

A cell can be selected by clicking on it or navigating with the arrow keys.
The edit-mode can be entered by pressing `Enter` after selecting or double-clicking a cell. To exit edit-mode and thus entering navigation-mode again, press the `Esc` key.
You can apply the following format options to a cell: Press `B` to make the text bold, `I` to make it italic and `U` for underlining it.
Selected cells can be copied by presing `C`, cut with `X` and pasted with `V`.
You can also select cell ranges by clicking on the start cell, holding down the mouse while moving the cursor and relasing the mouse on the final cell.
Contents and format of the first cell in a selected range can be copied to all other selected cells by pressing `F`.
If the user presses `F` without having selected a range, the first above cell (in the current column) having content will be copied to all cells below until the current cursor position.

### Cell Types
