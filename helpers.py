from flask import redirect, render_template, session
from functools import wraps


def errorhandler(message, code=400):
    """Render error codes as messages to user."""
    return render_template("errors.html", top=code, bottom=message)

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


