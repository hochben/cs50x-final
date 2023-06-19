from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

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
    date = db.Column(db.Date, nullable=False, default=datetime.today())
    time = db.Column(db.Time, nullable=False, default=datetime.now().time())
    update_date = db.Column(db.Date, nullable=False, default=datetime.today())
    update_time = db.Column(db.Time, nullable=False, default=datetime.now().time())

    income = db.relationship("Income", backref="budget", uselist=False)
    savings = db.relationship("Savings", backref="budget", uselist=False)
    expenses = db.relationship("Expense", backref="budget")

    @property
    def income_amount(self):
        """Get the income amount associated with the budget"""
        if self.income:
            return self.income.amount
        return 0.0

    @property
    def savings_amount(self):
        """Get the savings amount associated with the budget"""
        if self.savings:
            return self.savings.amount
        return 0.0

    @property
    def expense_categories(self):
        """Get the expense categories associated with the budget"""
        return [expense.category for expense in self.expenses]

    @property
    def expense_amounts(self):
        """Get the expense amounts associated with the budget"""
        return [expense.amount for expense in self.expenses]


class Income(db.Model):
    """Income table"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    amount = db.Column(db.Float(precision=2), nullable=False)


class Expense(db.Model):
    """Expense table"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    amount = db.Column(db.Float(precision=2), nullable=False)
    category = db.Column(db.String(20), nullable=False)

    budget_relation = db.relationship("Budget", backref=db.backref("budget_expenses", cascade="all, delete-orphan"))


class Savings(db.Model):
    """Savings table"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    amount = db.Column(db.Float(precision=2), nullable=False)
