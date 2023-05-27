from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def hello():
    #url = request.form["url"]
    json = {
        "Hello": ["00:01", "00:40"],
        "World": ["01:22", "02:11"]
    }

    return json