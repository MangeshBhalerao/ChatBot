from flask import Flask,request

app = Flask(__name__)

@app.route("/")
def Home():
    return 'Hello this is home'

@app.route("/chat" , methods = ["POST"])
def chat():
    if request.method == "POST":
        message = request.json.get('message')
        return {f"You said: {message}"}
    

if __name__ == "__main__":
    app.run(debug=True)