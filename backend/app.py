from flask import Flask,request
from models.ai_models import load_model
import torch

app = Flask(__name__)

print("Loading AI Model...")
tokenizer , model = load_model()
print("AI Model Loaded Successfully")

def generate_ai_response(user_message):
    input = tokenizer.encode(user_message , return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            inputs, 
            max_length=100, 
            num_return_sequences=1,
            temperature=0.7
        )
    
    # Decode the response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response


@app.route("/")
def Home():
    return 'Hello this is home'

@app.route("/chat" , methods = ["POST"])
def chat():
    if request.method == "POST":
        user_message = request.json.get('message')
    
        ai_response = generate_ai_response(user_message)

        return {"response": ai_response}
    

if __name__ == "__main__":
    app.run(debug=True)