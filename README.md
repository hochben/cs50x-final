# Budget Manager
### Video Demo:  https://youtu.be/sOYXw6n6ids
## Description:
This web app serves as a budget manager, helping users keep track of their finances and manage their expenses. The app provides a user-friendly interface to input income and expenses, categorize them, and view a summary of their spending habits.
<p>This project was developed as part of the CS50 course.</p>

## Features
- **Income and Expense Tracking:**
Users can easily add their income, savings and expenses to the app, specifying the amount and expense categories.
- **Categorization:** Expenses can be categorized into different predefined categories, allowing users to analyze their spending patterns.
- **Summary and Visualization:** The app provides an overview of the user's finances, including total income, total expenses, and a breakdown of expenses by category. This information is presented in visually appealing charts and graphs.
- **User Authentication:** The app supports user registration and authentication, ensuring that each user's data is secure and private.
Password can be changed in the user drop down menu on the top left.
- **Responsive Design:** The app is designed to be responsive and compatible with different devices, including desktops, tablets, and mobile phones.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript, charts.js
- **Backend:** Python, Flask
- **Database:** SQLite using SQLAlchemy

## Installation and Setup
Clone this repository to your local machine.<br>
Install the required dependencies by running the following command:<br>
`pip install -r requirements.txt`<br><br>
Start the application by running the following command:<br>
`flask run`<br><br>
Open your web browser and visit http://localhost:5000 to access the app.

## Usage
Register a new account or log in with your existing credentials.
Add your income and expenses using the provided form in "Create Budget".
Explore the different features of the app, such as categorizing expenses, setting budgets, and viewing the summary.
Analyze your spending patterns and adjust your budget accordingly.

## File Structure Overview
Here is an overview of the project structure:<br>
```
Budget Manager
|
+-- /instance
|   |
|   +-- database.db - This is the database file
|
+-- /static
|   |
|   +-- /css
|   |   |
|   |   +-- style.css - CSS Styles are defined here
|   |
|   +-- /img
|   |
|   +-- /js
|       |
|       +-- script.js - Sidebar Toggle, Dropdown Menu, Charts, Add/Remove Entry Buttons, Update Budget functions
|
+-- /templates
|   |
|   +-- change_password.html - Form to change password
|   |
|   +-- create_budget.html - Form to create a budget, or if a budget already exists, update values
|   |
|   +-- errors.html - errorpage for handling errors and displaying them to the user
|   |
|   +-- index.html - Dashboard and main page of the Budget Manager
|   |
|   +-- layout.html - layout template, which every other site builts upon.
|   |
|   +-- login.html - Form for logging in a user
|   |
|   +-- register.html - Form for registering a new user
|
+-- app.py - main Flask Backend file, which includes the routes: "/", "/register", "/login", "/logout", "/change_password", "create_budget",
|            "/budget_data" which will retrieve the budget data and and send it as a JSON response to the Front-End,
|            "/update_budget_values" which will retrieve the updated values and send it as a JSON response to the Front-End.
|
+-- helpers.py - Herein defined are helper functions, such as errorhandler, login_required and the class categories,
                 which lists all predefined expense categories.
|
+-- models.py - Here are all tables defined for the database.db file
|
+-- README.md - Readme file
|
+-- requirements.txt - Includes all dependencies used for this project
```

## Future Enhancements
- Add the ability to generate reports and export financial data in different formats (e.g., PDF, CSV).
- Include more advanced analysis tools, such as trend analysis and predictive models, to provide deeper insights into users' finances.
- Allow users to set financial goals and track their progress towards achieving them.

## Contributors
Benjamin Hoch (@hochben)

## License
This project is licensed under the MIT License.
