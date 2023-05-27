from flask import Flask
from flask import request
from flask_cors import CORS



app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    #url = request.form["url"]
    json = {
        "Hello": ["00:01", "00:40"],
        "World": ["01:22", "02:11"]
    }

    return json