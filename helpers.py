from flask import redirect, render_template, session
from functools import wraps

# Reference: helpers.py from week9 pset "finance"
def errorhandler(message, code=400):
    """Render error codes as messages to user."""
    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("errors.html", top=code, bottom=escape(message)), code


# Reference: helpers.py from week9 pset "finance"
def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


# Define global expense categories
class categories():
    expense_categories = [
        "Childcare", "Debt Payments", "Dining Out", "Education", "Entertainment", "Gifts/Donations",
        "Groceries", "Health/Medical", "Hobbies/Recreation", "Home Maintenance", "Insurance",
        "Pet Expenses", "Rent/Mortgage", "Shopping", "Subscriptions", "Taxes",
        "Transportation", "Travel", "Utilities", "Miscellaneous"
    ]
