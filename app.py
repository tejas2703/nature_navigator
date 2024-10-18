from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Load models and scalers for the three species
models = {
    'Hornbill': {
        'lat_model': joblib.load('./model/hornbill_lat_model.pkl'),
        'long_model': joblib.load('./model/hornbill_long_model.pkl'),
        'scaler': joblib.load('./model/hornbill_scaler.pkl')
    },
    'Albatros': {
        'lat_model': joblib.load('./model/amsterdam_lat_model.pkl'),
        'long_model': joblib.load('./model/amsterdam_long_model.pkl'),
        'scaler': joblib.load('./model/amsterdam_scaler.pkl')
    },
    'Flying_Fox': {
        'lat_model': joblib.load('./model/flying-lat.pkl'),
       'long_model': joblib.load('./model/flying_long_model.pkl'),
        'scaler': joblib.load('./model/flying_scaler.pkl')
         
    },
    'African_Lion': {
        'lat_model': joblib.load('./model/lion_lat_model.pkl'),
       'long_model': joblib.load('./model/lion_long_model.pkl'),
        'scaler': joblib.load('./model/lion_scaler.pkl')
         
    }
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    species = data['species']
    date_str = data['date']  # Expected format: 'YYYY-MM-DD HH:MM:SS'

    # Convert date string to datetime object
    future_timestamp = pd.to_datetime(date_str)

    # Extract year, month, day, hour, minute, second
    future_features = {
        'year': future_timestamp.year,
        'month': future_timestamp.month,
        'day': future_timestamp.day,
        'hour': future_timestamp.hour,
        'minute': future_timestamp.minute,
        'second': future_timestamp.second
    }

    # Convert to DataFrame for scaling
    future_df = pd.DataFrame([future_features])

    # Select the models and scaler for the chosen species
    lat_model = models[species]['lat_model']
    long_model = models[species]['long_model']
    scaler = models[species]['scaler']

    # Scale the input data
    future_scaled = scaler.transform(future_df)

    # Predict latitude and longitude
    future_lat = lat_model.predict(future_scaled)
    future_long = long_model.predict(future_scaled)

    # Return the prediction as JSON
    return jsonify({
        'latitude': future_lat[0],
        'longitude': future_long[0]
    })

if __name__ == '__main__':
    app.run(debug=True)
