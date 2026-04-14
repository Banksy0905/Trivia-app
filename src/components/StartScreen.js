import React from "react";

function StartScreen({ startGame, setCategory, setDifficulty }) {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", marginTop: "50px"}}>
            <h1>Trivia Game</h1>
            <p>Select your preferences below to begin:</p>
            
            {/* Category Selection */}
            <div>
                <label style={{ marginRight: "10px" }}>Category:</label>
                <select onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Any Category</option>
                    <option value="9">General Knowledge</option>
                    <option value="21">Sports</option>
                    <option value="11">Film</option>
                    <option value="14">Television</option>
                    <option value="15">Video Games</option>
                    <option value="12">Music</option>
                    <option value="20">Mythology</option>
                </select>
            </div>

            {/* Difficulty Selection */}
            <div>
                <label style={{ marginRight: "10px" }}>Difficulty:</label>
                <select onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <button onClick={startGame} 
                style={{padding: "10px 25px", fontSize: "16px", cursor: "pointer", marginTop: "10px"}}
            >
                Start Game
            </button>
        </div>
    );
}

export default StartScreen;