import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import joblib

# 1. Load the dataset
df = pd.read_csv('cleaned_species_data.csv')

# 2. Preprocessing
# Convert timestamp to datetime format
# Convert timestamp to datetime format with a specified format
df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d-%m-%Y %H:%M')


# Create new features from the timestamp
df['year'] = df['timestamp'].dt.year
df['month'] = df['timestamp'].dt.month
df['day'] = df['timestamp'].dt.day
df['hour'] = df['timestamp'].dt.hour
df['minute'] = df['timestamp'].dt.minute
df['second'] = df['timestamp'].dt.second

# Select relevant features for the model (removing 'eobs:temperature')
features = ['year', 'month', 'day', 'hour', 'minute', 'second']
X = df[features]
y_lat = df['location-lat']
y_long = df['location-long']

# 3. Train-test split (80% train, 20% test)
X_train, X_test, y_lat_train, y_lat_test, y_long_train, y_long_test = train_test_split(X, y_lat, y_long, test_size=0.2, random_state=42)

# 4. Standardize the features
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Random Forest Regressor for Latitude
model_lat = RandomForestRegressor(n_estimators=100, random_state=42)
model_lat.fit(X_train_scaled, y_lat_train)

# 6. Random Forest Regressor for Longitude
model_long = RandomForestRegressor(n_estimators=100, random_state=42)
model_long.fit(X_train_scaled, y_long_train)

# Redirect output to a file
with open('hornbill_model_summary.txt', 'w') as f:
    # 7. Predictions and Evaluation
    lat_pred = model_lat.predict(X_test_scaled)
    long_pred = model_long.predict(X_test_scaled)

    f.write("Latitude Predictions Evaluation:\n")
    f.write(f"MAE: {mean_absolute_error(y_lat_test, lat_pred)}\n")
    f.write(f"RMSE: {np.sqrt(mean_squared_error(y_lat_test, lat_pred))}\n")

    f.write("\nLongitude Predictions Evaluation:\n")
    f.write(f"MAE: {mean_absolute_error(y_long_test, long_pred)}\n")
    f.write(f"RMSE: {np.sqrt(mean_squared_error(y_long_test, long_pred))}\n")

    # 8. Predict future locations (example)
    # Assuming we want to predict for a future timestamp: 2025-03-01 12:30:00
    future_timestamp = pd.to_datetime('2025-03-01 12:30:00')
    future_features = {
        'year': future_timestamp.year,
        'month': future_timestamp.month,
        'day': future_timestamp.day,
        'hour': future_timestamp.hour,
        'minute': future_timestamp.minute,
        'second': future_timestamp.second
    }

    # Convert to DataFrame and scale it
    future_df = pd.DataFrame([future_features])
    future_scaled = scaler.transform(future_df)

    # Make predictions for latitude and longitude
    future_lat = model_lat.predict(future_scaled)
    future_long = model_long.predict(future_scaled)

    f.write(f"\nPredicted Future Location (Latitude, Longitude): ({future_lat[0]}, {future_long[0]})\n")

# Optional: Plot true vs predicted for latitudes and longitudes
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.scatter(y_lat_test, lat_pred, color='blue', alpha=0.5)
plt.title('Latitude: True vs Predicted')
plt.xlabel('True Latitude')
plt.ylabel('Predicted Latitude')

plt.subplot(1, 2, 2)
plt.scatter(y_long_test, long_pred, color='green', alpha=0.5)
plt.title('Longitude: True vs Predicted')
plt.xlabel('True Longitude')
plt.ylabel('Predicted Longitude')

plt.tight_layout()
plt.show()

# Save the latitude model
joblib.dump(model_lat, 'hornbill_lat_model.pkl')

# Save the longitude model
joblib.dump(model_long, 'hornbill_long_model.pkl')

# Save the scaler
joblib.dump(scaler, 'hornbill_scaler.pkl')

print("Models and scaler saved successfully.")
