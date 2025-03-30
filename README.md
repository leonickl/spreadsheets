# Spreadsheets

This application provides a collaborative browser-based spreadsheets-client.

> [!WARNING]
> This application is still in development. Sudden data loss can occur at any time. Please make backups of your data directory!

![](./public/demo.png)

## Setup

- Requires nodejs and npm to be installed
- Navigate to project directory
- Run `npm install` to install dependencies

## Starting

- Run `npm run start` to start frontend and backend together
- To start only the frontend, run `npm run dev`
- And for only the backend, run `node server.js`

## Manual

### Menu Buttons

### Navigation, Formatting and Selecting

- A cell can be selected by clicking on it or navigating with the arrow keys
- The edit-mode can be entered by pressing `Enter` after selecting or double-clicking a cell. To exit edit-mode and thus entering navigation-mode again, press the `Esc` key
- You can apply the following format options to a cell: Press `B` to make the text bold, `I` to make it italic and `U` for underlining it
- Selected cells can be copied by presing `C`, cut with `X` and pasted with `V`
- You can also select cell ranges by clicking on the start cell, holding down the mouse while moving the cursor and relasing the mouse on the final cell
- Contents and format of the first cell in a selected range can be copied to all other selected cells by pressing `F`
- If the user presses `F` without having selected a range, the first above cell (in the current column) having content will be copied to all cells below until the current cursor position
- Pressing `+` or `-`, the number of decimals for floating point numbers can be adjusted

### Cell Types

- Percent: The value will be shown as a percentage, e.g., the cell value "0.19" will be shown as "19 %"
- Money: The value will be postfixed with a currency symbol
- Special: This field type recognizes URLs, e-mail addresses and phone numbers and formats those as links
- Checkbox: A checkbox field contains a clickable checkbox toggling the cell value between 0 (no) and 1 (yes). If a formula cell has a this type, the status of the checkbox is not toggleable manually by the user, but calculated
- Select: A select field lets the user select a select list in the new dropdown appearing next to the cell type dropdown. Such lists are stored within each spreadsheet and can be added, edited and delted in the corresponding menu button. The cell value is stored as a list and can be further used in formulas

### Formulas

Each cell whose value starts with `=`, contains a formula which is automatically calculated.
Formulas can contain:

- Functions: Apply a function to one or more values, e.g., `=sin(4)`, `=len([1,4,7])`, `=sum(A1:B5)`
- Operators: Use the arithmetic operators `+`, `-`, `*`, `/` between two numbers, and `<`, `>`, `=`, `<=`, `>=` for logical comparisons
- Numbers: Enter integers, floating point numbers or scientific notation like `5e3`
- Lists/Arrays: `=[1, 6, 9]`, to which other functions can be applied; is basically the same as a cell with select type, but unformatted
- Texts/Strings: `="Hello World`; or in formulas like `=if(B4, "yes", "no")`
- Cell references: Returns the value of the referenced cell, e.g., `=A3`, `=F25`. In Excel, copying a formula to new cells changes the references unless prefixed with `$`. That's not the case here; references are always static. If you want to use such relative references, use `#` to reference "current row"/"current column", e.g., `=A#` means "column a in the current row and `=#10` means "row 10 in the current column".Such a relative formula can be copied using the shortcut `F` form above
- Cell ranges: Like a list of the values in the range, e.g., `=A9:A10` or `=C20:E87`

**All available functions (defined in `src/lib/functions.js`):**

- `json(value1, [value2, valu3, ...])`: Generates a json string from the given values as an array
- `sum(list)`: Calculates the sum of all values in the list
- `prod(list)`: Calculates the product of all values in the list
- `mean(list)`: Calculates the arithmetic mean/average of all values in the list
- `min(list)`: Calculates the min of all values in the list
- `max(list)`: Calculates the max of all values in the list
- `sin(x)`, `cos(x)`, `tan(x)`: Calculate sine, cosine and tangent
- `exp(x)`, `log(x)`: Calculate natural exponential function and logarithm
- `if(test, yes, no)`: Returns yes/no based on test being true/1 or false/0
- `and(a, b)`, `or(a, b)`, `not(a)`: Boolean functions to connect multiple logical statements, e.g., in an `if(...)`
- `eq(x, y)`: Does the same as `==`, but additionaly works for arrays, comparing them value by value
- `pow(x, y)`: Calculates x to the power y
- `in(needle, haystack)`: Check if needle is contained in the list haystack
- `len(list)`: Calculates the length of a list (except empty values)
- `merge(list1, [list2, list3, ...])`: Mserges multiple lists and flattens them; can also be used to flatten list1 if no more arguments are given
