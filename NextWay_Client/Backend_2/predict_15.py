from flask import Flask, request, jsonify
import pickle
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load your trained model
model_path = "model.pkl"  # Ensure your model is saved as a .pkl file
with open('model_2.pkl', "rb") as file:
    dct = pickle.load(file)

# Define route to handle predictions
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get data from the request
        data = request.json
        responses = data.get("responses", [])

        # Validate that exactly 10 responses are received, all between 1 and 4
        if len(responses) != 15 or not all(1 <= int(resp) <= 4 for resp in responses):
            return jsonify({"error": "Invalid responses. Expected 10 answers with values between 1 and 4."}), 400

        # Predict using the model
        prediction = dct.predict([responses])
        fields = [
            "Software Development",
            "Civil Works",
            "Construction",
            "Designing",
            "Health"
        ]

        # Return the predicted field
        return jsonify({"prediction": fields[int(prediction[0])]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Start the app
if __name__ == "__main__":
    app.run(debug=True, port=5002)
