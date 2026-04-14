import React from "react";

function Results({ score, total, restart, changeSettings }) {
  const highScores = JSON.parse(localStorage.getItem("scores")) || [];

  return (
    <div>
      <h2>Your Score: {score}/{total}</h2>

      <h3>Top Scores:</h3>
      <ul style={{listStylePosition:"inside", padding: 0}}>
        {highScores.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <div style={{display:"flex", gap:"10px", justifyContent:"center" }}>
        <button onClick={restart}>Play Again (Same Settings)</button>
        <button onClick={changeSettings}>Change Settings</button>
      </div>
    </div>
  );
}

export default Results;