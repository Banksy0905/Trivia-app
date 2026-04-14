import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import Quiz from "./components/Quiz"; 
import Results from "./components/Results"; 
import "./App.css"; 

function App() {
  const [gameState, setGameState] = useState("START_SCREEN");
  const [questions, setQuestions] = useState([]); 
  const [score, setScore] = useState(0); 
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const fetchQuestions = async () => {
    try {
      let url = `https://opentdb.com/api.php?amount=10&type=multiple`;
      if (category) url += `&category=${category}`;
      if (difficulty) url += `&difficulty=${difficulty}`;

      const res = await fetch(url);
      const data = await res.json(); 
      
      if (data.response_code !== 0) {
        alert("No questions found! Try changing your settings.");
        setGameState("START_SCREEN");
        return; 
      }
      setQuestions(data.results);
    } catch (error) {
      console.error("Error fetching questions:", error); 
      setGameState("START_SCREEN");
    }
  };

  const startGame = async () => {
    setScore(0);
    setCurrentQuestion(0);
    await fetchQuestions();
    setGameState("QUIZ_ACTIVE");
  };

  const handleAnswer = (answer) => {
    let finalScore = score;
    
    
    if (answer === questions[currentQuestion].correct_answer) {
      finalScore = score + 1;
      setScore(finalScore);  
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);  
    } else {
      
      saveHighScore(finalScore);
      setGameState("RESULTS_SCREEN"); 
    }
  };

  const saveHighScore = (newScore) => {
    const existingScores = JSON.parse(localStorage.getItem("scores")) || [];
    
    const updatedScores = [...existingScores, newScore]
      .sort((a, b) => b - a)
      .slice(0, 5); 
      
    localStorage.setItem("scores", JSON.stringify(updatedScores));
  };

  const restartGame = async () => {
    setGameState("LOADING"); 
    setScore(0);
    setCurrentQuestion(0);
    setQuestions([]);
    await fetchQuestions(); 
    setGameState("QUIZ_ACTIVE"); 
  };

  const changeSettings = () => {
    setCategory("");
    setDifficulty("");
    setScore(0);
    setCurrentQuestion(0);
    setGameState("START_SCREEN"); 
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {gameState === "START_SCREEN" && (
        <StartScreen startGame={startGame} setCategory={setCategory} setDifficulty={setDifficulty} />
      )}

      {gameState === "LOADING" && <h2>Loading New Questions...</h2>}
      
      {gameState === "QUIZ_ACTIVE" && questions?.length > 0 && (
        <Quiz
          questions={questions}
          currentQuestion={currentQuestion}
          handleAnswer={handleAnswer}
        />
      )}

      {gameState === "RESULTS_SCREEN" && (
        <Results
          score={score}
          total={questions?.length || 0}
          restart={restartGame}
          changeSettings={changeSettings}
        />
      )}
    </div>
  );
}

export default App;