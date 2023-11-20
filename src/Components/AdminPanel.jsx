import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import "../Styles/adminpanel.css";

const AdminPanel = () => {
  const [adminData, setAdminData] = useState(null);
  const [customerAmount, setCustomerAmount] = useState(0);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://stg.dhunjam.in/account/admin/4"
        );
        setAdminData(response.data.data);
        setCustomerAmount(response.data.data.amount.category_6);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (adminData) {
      const regularSongRequestAmounts = Object.values(adminData.amount);
      const chartData = {
        labels: [
          "Custom",
          "Category 6",
          "Category 7",
          "Category 8",
          "Category 9",
        ],
        datasets: [
          {
            label: "Charge Amount",
            data: regularSongRequestAmounts,
            backgroundColor: [
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
            ],
            borderColor: [
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
              "rgba(240, 195, 241, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      if (chartRef && chartRef.current) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
          type: "bar",
          data: chartData,
        });
      }
    }
  }, [adminData]);

  useEffect(() => {
    if (adminData && chartInstance.current) {
      const updatedRegularSongRequestAmounts = Object.values(adminData.amount);
      chartInstance.current.data.datasets[0].data =
        updatedRegularSongRequestAmounts;
      chartInstance.current.update();
    }
  }, [adminData]);

  useEffect(() => {
    if (adminData && chartInstance.current) {
      chartInstance.current.data.datasets[0].data[1] = customerAmount;
      chartInstance.current.update();
    }
  }, [customerAmount]);

  const handlePriceUpdate = async () => {
    try {
      const response = await axios.put(
        "https://stg.dhunjam.in/account/admin/4",
        {
          amount: {
            category_6: customerAmount,
          },
        }
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const handleRegularSongAmountChange = (e, index) => {
    const updatedAmount = e.target.value;
    const updatedAdminData = { ...adminData };
    updatedAdminData.amount[`category_${index + 6}`] = Number(updatedAmount);

    setAdminData(updatedAdminData);
  };

  return (
    adminData && (
      <div className="admin_panel">
        <span className="admin_header">
          {adminData.name}, {adminData.location} on Dhun Jam
        </span>
        <div className="dashboard">
          <div className="content_order">
            <p>Do you want to charge your customers for requesting songs?</p>
            <div>
              <input
                type="radio"
                value="yes"
                name="charge_customers"
                checked={adminData.charge_customers === true}
              />
              Yes
              <input
                type="radio"
                value="no"
                name="charge_customers"
                checked={adminData.charge_customers === false}
              />
              No
            </div>
          </div>
          <div className="content_order">
            <p>Custom song request amount-</p>
            <input
              type="number"
              className="amount_input"
              value={customerAmount}
              onChange={(e) => setCustomerAmount(e.target.value)}
              readOnly={adminData.charge_customers === false}
            />
          </div>
          <div className="content_order">
            <p>Regular song request amount from high to low-</p>
            <div className="amounts_order">
              {Object.keys(adminData.amount)
                .slice(1)
                .map((item, i) => (
                  <div key={i}>
                    <input
                      type="number"
                      value={adminData.amount[`category_${i + 6}`]}
                      onChange={(e) => handleRegularSongAmountChange(e, i)}
                      readOnly={adminData.charge_customers === false}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        {adminData.charge_customers && (
          <div className="chart_container">
            <canvas ref={chartRef} width={500} height={300}></canvas>
          </div>
        )}
        <button type="submit" className="save_btn" onClick={handlePriceUpdate}>
          Save
        </button>
      </div>
    )
  );
};

export default AdminPanel;
