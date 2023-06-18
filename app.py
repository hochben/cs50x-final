from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, date
import secrets

from helpers import errorhandler, login_required
from models import db, Users, Budget, Income, Expense, Savings

# Initialize Flask application
app = Flask(__name__)

# Set secret key
secret_key = secrets.token_hex(16)
app.secret_key = secret_key

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Connect to database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db.init_app(app)

with app.app_context():
        db.create_all()


@app.route('/')
@login_required
def index():
    """Show dashboard"""

    # Get the current user
    current_user = Users.query.filter_by(user_id=session["user_id"]).first()
    username = current_user.username

    # Get the current budget
    current_budget = Budget.query.filter_by(user_id=current_user.user_id).order_by(Budget.id.desc()).first()
    existing_budget = True if current_budget else False

    # Initialize budget_data
    budget_data = {}

    # Check if current_budget is None
    if current_budget is None:
        budget_name = ""
        budget_date = ""
        budget_time = ""
        update_date = ""
        update_time = ""
        income = 0
        total_expenses = 0
        savings = 0
    else:
        # Retrieve the budget name, date, and time from the current_budget
        budget_name = current_budget.name
        budget_date = current_budget.date
        budget_time = current_budget.time

        # Retrieve income and total expenses
        incomes = Income.query.filter(Income.user_id == current_user.user_id).with_entities(Income.amount).first()
        income = incomes[0] if incomes else 0
        savings = Savings.query.filter(Savings.user_id == current_user.user_id).with_entities(Savings.amount).first()
        savings = savings[0] if savings else 0
        expenses = Expense.query.filter(Expense.user_id == current_user.user_id).with_entities(Expense.amount).all()


        expense_amounts = []

        # Add expense amounts to the lists
        for expense in expenses:
            expense_amounts.append(expense.amount)

        # Calculate total expenses
        total_expenses = sum(expense_amounts) if expense_amounts else 0

        # Create a dictionary with income, expense data, and total expenses
        budget_data = {
            'income': income,
            'expenses': expenses,
            'total_expenses': total_expenses
        }

    return render_template("index.html", username=username, budget_data=budget_data, existing_budget=existing_budget,
                           budget_name=budget_name, budget_date=budget_date, budget_time=budget_time,
                           income=income, expenses=total_expenses, savings=savings)
        

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register User"""

    # User reached route via POST
    if request.method == "POST":

        # Ensure Username was submitted
        username = request.form.get("username")
        if not username:
            return errorhandler("must provide username", 400)

        # Ensure password was submitted
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        if not password or not confirmation:
            return errorhandler("must provide password", 400)

        # Ensure password and confirmation match
        if password != confirmation:
            return errorhandler("passwords do not match", 400)

        # Check if Username already exists
        existing_user = Users.query.filter_by(username=username).first()
        if existing_user:
            return errorhandler("Username already exists", 400)

        # Insert new User into database
        hashed_password = generate_password_hash(password)
        new_user = Users(username=username, hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        # Redirect User to login page
        flash('User created successfully!', 'success')
        return redirect("/login")

    # User reached route via GET
    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log User in"""

    # Forget any User_id
    session.clear()

    # User reached route via POST
    if request.method == "POST":

        # Ensure Username was submitted
        username = request.form.get("username")
        if not username:
            return errorhandler("must provide username", 400)

        # Ensure password was submitted
        password = request.form.get("password")
        if not password:
            return errorhandler("must provide password", 400)

        # Query database for Username
        user = Users.query.filter_by(username=username).first()

        # Ensure Username exists and password is correct
        if user is None or not check_password_hash(user.hash, password) or user.username != username:
            return errorhandler("invalid username and/or password", 400)

        # Remember which User has logged in
        session["user_id"] = user.user_id

        # Redirect User to home page
        return redirect("/")

    # User reached route via GET
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log User out"""

    # Forget any User_id
    session.clear()

    # Redirect User to login form
    flash('Log out successfull!', 'success')
    return redirect("/login")


@app.route("/change_password", methods=["GET", "POST"])
@login_required
def change_password():
    """Change User's password"""

    if request.method == "POST":

        # Get the current user
        current_user = Users.query.get(session["user_id"])
        username = current_user.username

        # Retrieve the current password entered by the User
        current_password = request.form.get("current_password")

        # Check if the entered current password matches the User's actual password
        if not check_password_hash(current_user.hash, current_password):
            return errorhandler("current password is incorrect", 400)

        # Retrieve the new password entered by the User
        new_password = request.form.get("new_password")
        confirmation = request.form.get("confirmation")

        # Ensure new password and confirmation match
        if new_password != confirmation:
            return errorhandler("new passwords do not match", 400)

        # Generate a hash for the new password
        new_hashed_password = generate_password_hash(new_password)

        # Update the User's password in the database
        current_user.hash = new_hashed_password
        db.session.commit()

        # Redirect User to home page
        flash('Password changed successfully!', 'success')
        return redirect("/")
    
    # User reached route via GET
    else:
        # Get the current user
        current_user = Users.query.get(session["user_id"])
        # Retrieve the username from the current_user object
        username = current_user.username
        
        return render_template("change_password.html", username=username)


@app.route("/create_budget", methods=["GET", "POST"])
@login_required
def create_budget():
    """Create budget"""

    # Get the current user
    current_user = Users.query.get(session["user_id"])
    username = current_user.username
    existing_budget = Budget.query.filter_by(user_id=current_user.user_id).order_by(Budget.id.desc()).first()

    if request.method == "POST":
        # Get form data
        budget_name = request.form.get('budget_name')
        budget_date = request.form.get('budget_date')
        budget_time = request.form.get('budget_time')

        # If user has an existing budget, update the budget
        if existing_budget:
            # Update existing budget
            existing_budget.name = budget_name if budget_name else existing_budget.name
            existing_budget.income.amount = income if income else existing_budget.income.amount
            existing_budget.savings.amount = savings if savings else existing_budget.savings.amount

            # Update or create income entry
            if existing_budget.income:
                existing_budget.income.amount = income if income else existing_budget.income.amount
            else:
                income_entry = Income(user_id=current_user.user_id, budget_id=existing_budget.id, amount=income)
                db.session.add(income_entry)

            # Update or create savings entry
            if existing_budget.savings:
                existing_budget.savings.amount = savings if savings else existing_budget.savings.amount
            else:
                savings_entry = Savings(user_id=current_user.user_id, budget_id=existing_budget.id, amount=savings)
                db.session.add(savings_entry)

            # Update or create expense entries
            expense_categories = request.form.getlist('category[]')
            expense_amounts = request.form.getlist('amount[]')

            for category, amount in zip(expense_categories, expense_amounts):
                expense = Expense.query.filter_by(user_id=current_user.user_id, budget_id=existing_budget.id, category=category).first()
                if expense:
                    expense.amount = amount
                else:
                    new_expense = Expense(user_id=current_user.user_id, budget_id=existing_budget.id, category=category, amount=amount)
                    db.session.add(new_expense)

            # Update the update_date and update_time
            existing_budget.update_date = datetime.today().date()
            existing_budget.update_time = datetime.now().time()

            db.session.commit()

            # Set the session variables
            session["username"] = current_user.username
            session["budget_name"] = existing_budget.name
            session["budget_date"] = existing_budget.date
            session["budget_time"] = existing_budget.time

            # Redirect user to home page
            flash('Budget updated successfully!', 'success')

            return redirect("/")

        # If user does not have an existing budget, create a new budget
        else:
            new_budget = Budget(user_id=current_user.user_id, name=budget_name, date=budget_date, time=budget_time)
            db.session.add(new_budget)
        
        # Update or create income entry
        income = request.form.get("income")

        # Check if income entry already exists
        existing_income = Income.query.filter_by(user_id=current_user.user_id, budget_id=new_budget.id).first()

        if existing_income:
            existing_income.amount = income
        elif income is None:
            income_entry = Income(user_id=current_user.user_id, budget_id=new_budget.id, amount=0)
            db.session.add(income_entry)
        else:
            income_entry = Income(user_id=current_user.user_id, budget_id=new_budget.id, amount=income)
            db.session.add(income_entry)

        # Update or create expense entries
        expense_categories = request.form.getlist("expense_category")
        expense_amounts = request.form.getlist("expense_amount")

        # Iterate through the expense categories and amounts using zip() and pair them together
        for category, amount in zip(expense_categories, expense_amounts):
            existing_expense = Expense.query.filter_by(user_id=current_user.user_id, budget_id=new_budget.id, category=category).first()

            if existing_expense:
                existing_expense.amount = amount
            elif amount is None:
                expense_entry = Expense(user_id=current_user.user_id, budget_id=new_budget.id, amount=0, category=category)
                db.session.add(expense_entry)
            else:
                expense_entry = Expense(user_id=current_user.user_id, budget_id=new_budget.id, amount=amount, category=category)
                db.session.add(expense_entry)

        # Create or update savings entry
        savings = request.form.get("savings")
        existing_savings = Savings.query.filter_by(user_id=current_user.user_id, budget_id=new_budget.id).first()

        if existing_savings:
            existing_savings.amount = savings
        elif savings is None:
            savings_entry = Savings(user_id=current_user.user_id, budget_id=new_budget.id, amount=0)
            db.session.add(savings_entry)
        else:
            savings_entry = Savings(user_id=current_user.user_id, budget_id=new_budget.id, amount=savings)
            db.session.add(savings_entry)

        # Commit all changes to the database
        db.session.commit()

        # Set the session variables
        session["username"] = current_user.username
        session["budget_name"] = new_budget.name
        session["budget_date"] = new_budget.date
        session["budget_time"] = new_budget.time

        # Redirect user to home page
        flash('Budget created successfully!', 'success')
        return redirect("/")
    
    # User reached route via GET
    else:
        # Retrieve existing budget details for the current user
        existing_budget = Budget.query.filter_by(user_id=current_user.user_id).order_by(Budget.id.desc()).first()
        
        # Query existing expense categories for the current user and budget
        if existing_budget is not None:
            existing_expenses = Expense.query.filter_by(user_id=current_user.user_id, budget_id=existing_budget.id).all()
        else:
            existing_expenses = []

        # Get all available categories
        all_categories = [
            "Childcare", "Debt-Payments", "Dining Out", "Education", "Entertainment", "Gifts/Donations",
            "Groceries", "Health/Medical", "Hobbies/Recreation", "Home-Maintenance", "Insurance",
            "Pet-Expenses", "Rent/Mortgage", "Shopping", "Subscriptions", "Transportation", "Taxes",
            "Travel", "Utilities", "Miscellaneous"
        ]

        # Extract used categories from existing expenses
        used_categories = [expense.category for expense in existing_expenses]

        # Calculate unused categories
        unused_categories = list(set(all_categories) - set(used_categories))

        return render_template("create_budget.html", username=username, existing_expenses=existing_expenses, unused_categories=unused_categories)      


@app.route("/budget_data")
@login_required
def budget_data():
    # Get the current user
    current_user = Users.query.get(session["user_id"])

    # Retrieve income and expense data for the current user
    income = Income.query.filter(Income.user_id == current_user.user_id).with_entities(Income.amount).first()
    expenses = Expense.query.filter(Expense.user_id == current_user.user_id).with_entities(Expense.amount, Expense.category).all()

    # Prepare the data for chart.js
    # Create a dictionary with income data
    if income:
        income_data = {
            'label': 'Income',
            'amount': income.amount
        }
    else:
        income_data = {
            'label': 'Income',
            'amount': 0
        }

    # Create lists for expense labels and amounts
    expense_labels = []
    expense_amounts = []

    # Add expense labels and amounts to the lists
    for expense in expenses:
        expense_labels.append(expense.category)
        expense_amounts.append(expense.amount)

    # Calculate total expenses
    total_expenses = {
        'label': 'Total Expenses',
        'amount': sum(expense_amounts)
    }

    # Create a dictionary with expense data
    expense_data = {
        'categories': expense_labels,
        'amounts': expense_amounts
    }

    # Create a dictionary with income, expense data and total expenses
    budget_data = {
        'income': income_data,
        'expenses': expense_data,
        'total_expenses': total_expenses
    }

    return jsonify(budget_data)


# Run the application
if __name__ == '__main__':
    app.run()
