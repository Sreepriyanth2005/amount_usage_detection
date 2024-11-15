from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) # Enable CORS

# Load the model and feature names from the pickle file
with open('model.pkl', 'rb') as model_file:
    model, feature_names = pickle.load(model_file)

# Load the label encoder
with open('label_encoder.pkl', 'rb') as le_file:
    label_encoder = pickle.load(le_file)

# Your month dictionary for mapping
mondict = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
           7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    gender = data['gender']
    age = int(data['age'])
    transaction_amount = float(data['transaction_amount'])
    transaction_month = data['transaction_month']
    transaction_day = data['transaction_day']

    # Create a DataFrame for the input
    input_data = {
        'Gender': gender,
        'Age': age,
        'Transaction Amount': transaction_amount,
        'Transaction month': transaction_month,
        'Transaction day': transaction_day
    }

    input_df = pd.DataFrame([input_data])

    # Mapping the 'Transaction month' back to numbers using 'mondict'
    input_df['Transaction month'] = input_df['Transaction month'].map({v: k for k, v in mondict.items()})

    # Encode categorical features using one-hot encoding
    input_encoded = pd.get_dummies(input_df, columns=['Gender', 'Transaction month', 'Transaction day'], dtype=float)

    # Ensure the input has the same columns as during model training
    input_encoded = input_encoded.reindex(columns=feature_names, fill_value=0)

    # Predict using the loaded model
    prediction = model.predict(input_encoded.values)

    # Convert numerical prediction to original category name
    predicted_category = label_encoder.inverse_transform(prediction)[0]

    return jsonify({'prediction_text': "Predicted Category: " + predicted_category})

if __name__ == "__main__":
    app.run(debug=True)
