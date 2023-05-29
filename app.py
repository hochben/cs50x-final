from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import errorhandler, login_required

# Initialize Flask application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Connect to database
db = SQLAlchemy()
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db.init_app(app)

# Define database models
class user_table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    hash = db.Column(db.String, nullable=False)

with app.app_context():
    db.create_all()


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route('/')
@login_required
def index():
    """Show dashboard"""
    return render_template("index.html")  


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    # User reached route via POST
    if request.method == "POST":

        # Ensure username was submitted
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

        # Check if username already exists
        existing_user = db.session.execute(db.select(user_table).where(user_table.username == username))
        if existing_user:
            return errorhandler("username already exists", 400)

        # Insert new user into database
        hashed_password = generate_password_hash(password)
        db.session.execute(db.insert(user_table).values(username=username, hash=hashed_password))
        
        # Redirect user to login page
        return redirect("/login")

    # User reached route via GET
    else:
        return render_template("register.html")



@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    # Forget any user_id
    session.clear()

    # User reached route via POST
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return errorhandler("must provide username", 400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return errorhandler("must provide password", 400)

        # Query database for username
        rows = db.session.execute(db.select(user_table).where(user_table.username == request.form.get("username")))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return errorhandler("invalid username and/or password", 400)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


# Run the application
if __name__ == '__main__':
    app.run()
