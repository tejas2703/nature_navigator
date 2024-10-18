import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler

# 1. Load the saved models and scaler
model_lat = joblib.load('hornbill_lat_model.pkl')
model_long = joblib.load('hornbill_long_model.pkl')
scaler = joblib.load('hornbill_scaler.pkl')

# 2. Take date input from the user
user_input = input("Enter the future date and time (YYYY-MM-DD HH:MM:SS): ")

# 3. Convert the input into a datetime object
future_timestamp = pd.to_datetime(user_input)

# 4. Extract the relevant features (year, month, day, hour, minute, second)
future_features = {
    'year': future_timestamp.year,
    'month': future_timestamp.month,
    'day': future_timestamp.day,
    'hour': future_timestamp.hour,
    'minute': future_timestamp.minute,
    'second': future_timestamp.second
}

# 5. Convert to DataFrame and scale it
future_df = pd.DataFrame([future_features])
future_scaled = scaler.transform(future_df)

# 6. Predict latitude and longitude
future_lat = model_lat.predict(future_scaled)
future_long = model_long.predict(future_scaled)

# 7. Output the predicted latitude and longitude
print(f"Predicted Future Location (Latitude, Longitude): ({future_lat[0]}, {future_long[0]})")
