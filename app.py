from flask import Flask, flash, get_flashed_messages, redirect, render_template, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
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

    return render_template("index.html", username=username)  


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
        rows = db.session.execute(db.select(Users).where(Users.username == username)).first()

        # Ensure Username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0].hash, password):
            return errorhandler("invalid username and/or password", 400)

        # Remember which User has logged in
        session["user_id"] = rows[0].user_id

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
        return render_template("change_password.html")


@app.route("/create_budget", methods=["GET", "POST"])
@login_required
def create_budget():
    if request.method == "POST":
        # get current user and budget
        current_user = db.session.execute(db.select(["*"]).where(Users.user_id == session["user_id"])).first()
        current_budget = db.session.execute(db.select(["*"]).where(Budget.user_id == current_user.user_id)).first()

        # get income
        income = request.form.get("income")

        # get expenses
        categories = request.form.getlist("category[]")
        amounts = request.form.getlist("amount[]")
        expense_count = request.form.get("expense_count")

        # insert income into database
        db.session.execute(db.insert(Income).values(user_id=current_user.user_id, amount=income))
        db.session.commit()

        # create or retrieve budget for current user
        if not current_budget:
            db.session.execute(db.insert(Budget).values(user_id=current_user.user_id))
            db.session.commit()
            current_budget = db.session.execute(db.select(["*"]).where(Budget.user_id == current_user.user_id)).first()

        print("categories:", categories)
        print("amounts:", amounts)
        print("expense_count:", expense_count)

        # insert expense entries into database
        for i in range(int(expense_count)):
            expense = Expense(budget_id=current_budget.id, category=categories[i], amount=amounts[i])
            db.session.add(expense)
        db.session.commit()

        # redirect user to home page
        flash('Budget created successfully!', 'success')
        return redirect("/")
    
    # user reached route via GET
    else:
        return render_template("create_budget.html")


# Run the application
if __name__ == '__main__':
    app.run()
