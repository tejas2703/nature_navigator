// src/components/ModelInfo.js
import React from 'react';
import './App.css'; // Import the CSS file for styling

function ModelInfo() {
  return (
    <div className="model-info-container">
      <h1 className="title">ML Model Information</h1>
      <p className="description">
        Our predictive model uses machine learning techniques to forecast the future locations of wildlife
        based on telemetry data. The model takes into account various factors such as location coordinates,
        time of day, and species-specific behaviors. Here is a detailed journey of the model training and comparison with LSTM.
      </p>

      <h2 className="sub-title">ML Model Details</h2>
      <div className="model-details">
        <ul>
          <li><strong>Algorithm Used:</strong> Random Forest Regression</li>
          <li><strong>Input Features:</strong> Latitude, Longitude, Timestamp</li>
          <li><strong>Output:</strong> Predicted Location (Latitude and Longitude)</li>
          <li><strong>Accuracy:</strong> The model has been validated using historical data and demonstrates a high accuracy rate.</li>
        </ul>
      </div>

      <h2 className="sub-title">Comparison of Models</h2>
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Random Forest Regression</th>
              <th>LSTM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Training Time</td>
              <td>Shorter</td>
              <td>Longer</td>
            </tr>
            <tr>
              <td>Accuracy</td>
              <td>Latitude Predictions Evaluation:<br />
MAE: 0.006079686335559585<br />
RMSE: 0.00998358549985892<br /><br />

Longitude Predictions Evaluation:<br />
MAE: 0.008825362066166726<br />
RMSE: 0.0147875742732736</td>
<td>Latitude Predictions Evaluation:<br />
MAE: 0.08960468888823678<br />
RMSE: 0.00998358549985892<br /><br />

Longitude Predictions Evaluation:<br />
MAE: 0.07836335272867328<br />
RMSE: 0.0079882639261914</td>
            </tr>
            <tr>
              <td>Complexity</td>
              <td>Low complexity</td>
              <td>High complexity (Requires more data)</td>
            </tr>
            <tr>
              <td>Best For</td>
              <td>Static, structured data</td>
              <td>Sequential, time-series data</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="sub-title">Model Training Journey</h2>
      <div className="image-container2">
        <img src="model.png" alt="Accuracy Graph" className="graph-image" />
        <img src="model2.png" alt="Predicted vs Actual" className="graph-image" />
      </div>

      <div className="conclusion">
        <p>
          After comparing Random Forest and LSTM, we chose Random Forest Regression due to its simplicity and
          effectiveness on our specific dataset. The accuracy of the Random Forest model was high, and the results
          aligned well with actual wildlife movements, as seen in the graphs.
        </p>
      </div>
    </div>
  );
}

export default ModelInfo;
