from flask import Flask

# Initialize Flask application
app = Flask(__name__)

# Set up basic route
@app.route('/')
def index():
    return 'Welcome to the Budget Manager web app!'

# Run the application
if __name__ == '__main__':
    app.run()
