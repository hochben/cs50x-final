from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, date
import secrets

from helpers import errorhandler, login_required
from models import db, Users, Budget, Income, Expense

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
    current_user = db.session.execute(db.select(["*"]).where(Users.user_id == session["user_id"])).first()
    # Retrieve the username from the current_user result object
    username = current_user.username

    # Get the current budget
    current_budget = db.session.execute(db.select(["*"]).where(Budget.name == session.get("budget_name"))).first()

    # Check if current_budget is None
    if current_budget is None:
        budget_name = ""
        budget_date = ""
        budget_time = ""
    else:
        # Retrieve the budget name, date, and time from the current_budget result object
        budget_name = current_budget.name
        budget_date = current_budget.date
        budget_time = current_budget.time

    return render_template("index.html", username=username, budget_name=budget_name, budget_date=budget_date, budget_time=budget_time)


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
        existing_user = db.session.execute(db.select(Users).where(Users.username == username)).first()
        if existing_user:
            return errorhandler("Username already exists", 400)

        # Insert new User into database
        hashed_password = generate_password_hash(password)
        db.session.execute(db.insert(Users).values(username=username, hash=hashed_password))
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
        rows = db.session.execute(db.select(["*"]).where(Users.username == username)).first()

        # Ensure Username exists and password is correct
        if rows is None or not check_password_hash(rows.hash, password) or rows.username != username:
            return errorhandler("invalid username and/or password", 400)

        # Remember which User has logged in
        session["user_id"] = rows.user_id

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
        current_user = db.session.execute(db.select(["*"]).where(Users.user_id == session["user_id"])).first()

        # Retrieve the username from the current_user result object
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
        db.session.execute(db.update(Users).where(Users.user_id == current_user.user_id).values(hash=new_hashed_password))
        db.session.commit()

        # Redirect User to home page
        flash('Password changed successfully!', 'success')
        return redirect("/")
    
    # User reached route via GET
    else:
        # Get the current user
        current_user = db.session.execute(db.select(["*"]).where(Users.user_id == session["user_id"])).first()
        # Retrieve the username from the current_user result object
        username = current_user.username
        
        return render_template("change_password.html", username=username)


@app.route("/create_budget", methods=["GET", "POST"])
@login_required
def create_budget():
    """Create budget"""

    if request.method == "POST":

        # Get the current user
        current_user = db.session.execute(db.select(["*"]).where(Users.user_id == session["user_id"])).first()

        # Create a new budget
        budget_name = request.form.get("budget_name")
        existing_budget = db.session.execute(db.select(Budget).where(Budget.name == budget_name)).first()

        # If budget already exists, use the existing budget, otherwise create a new budget
        if existing_budget:
            new_budget = existing_budget
        else:
            new_budget = Budget(user_id=current_user.user_id, name=budget_name)
        
        # Get the budget creation date and time
        now = datetime.now()
        new_budget.date = date.today()
        new_budget.time = now.time()

        # Commit the new_budget to generate its ID
        db.session.add(new_budget)
        db.session.commit()

        # Get income
        income = request.form.get("income")

        # Create a new income entry 
        income_entry = Income(user_id=current_user.user_id, budget_id=new_budget.id, amount=income)

        # Create expense entries
        categories = request.form.getlist("category[]")
        amounts = request.form.getlist("amount[]")
        for i in range(len(categories)):
            expense_entry = Expense(
                user_id=current_user.user_id,
                budget_id=new_budget.id,
                amount=amounts[i],
                category=categories[i]
            )
            db.session.add(expense_entry)

        # Commit all changes to the database
        db.session.add(new_budget)
        db.session.add(income_entry)
        db.session.commit()

        # Save date and time of budget creation in session
        session["budget_name"] = budget_name
        session["budget_date"] = new_budget.date.strftime("%d/%m/%Y")
        session["budget_time"] = new_budget.time.strftime("%H:%M:%S")
        
        # Redirect user to home page
        flash('Budget created successfully!', 'success')
        return redirect("/")
    
    # User reached route via GET
    else:
        # Get the current user
        current_user = db.session.execute(db.select(["*"]).where(Users.user_id == session["user_id"])).first()
        # Retrieve the username from the current_user result object
        username = current_user.username
        
        return render_template("create_budget.html", username=username)


@app.route("/budget_data")
@login_required
def budget_data():
    # TODO: Add functionality to retrieve budget data from database
    return jsonify()


# Run the application
if __name__ == '__main__':
    app.run()
