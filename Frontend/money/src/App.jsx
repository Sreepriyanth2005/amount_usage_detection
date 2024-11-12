import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    gender: "Male",
    age: "",
    transaction_amount: "",
    transaction_month: "",
    transaction_day: "",
  });

  const [predictionText, setPredictionText] = useState("");

  const mondict = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData with a controlled value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPredictionText(response.data.prediction_text);
    } catch (error) {
      console.error("There was an error submitting the form", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-r from-pink-200 to-pink-300 rounded-xl shadow-lg mt-20 relative">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Transaction Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              placeholder="Enter age"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700">Transaction Amount:</label>
          <input
            type="number"
            name="transaction_amount"
            value={formData.transaction_amount}
            onChange={handleChange}
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700">Transaction Month:</label>
          <select
            name="transaction_month"
            value={formData.transaction_month}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a month</option>
            {Object.entries(mondict).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700">Transaction Day:</label>
          <select
            name="transaction_day"
            value={formData.transaction_day}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full p-3 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700"
          >
            Predict
          </button>
        </div>
      </form>

      {predictionText && (
        <h3 className="text-center text-xl font-semibold text-green-500 mt-6">{predictionText}</h3>
      )}
    </div>
  );
};

export default App;
