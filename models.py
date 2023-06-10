from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date, Time

db = SQLAlchemy()

class Users(db.Model):
    """Users table"""
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    hash = db.Column(db.String(128), nullable=False)
    

class Budget(db.Model):
    """Budget table"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    date = db.Column(Date, nullable=False)
    time = db.Column(Time, nullable=False)


class Income(db.Model):
    """Income table"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)


class Expense(db.Model):
    """Expense table"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(20), nullable=False)
