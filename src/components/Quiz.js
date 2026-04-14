import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import correctSoundFile from "../assets/correct_ding.mp3";
import incorrectSoundFile from "../assets/incorrect_buzz.mp3";

function Quiz({ questions, currentQuestion, handleAnswer }) {
  const [time, setTime] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(""); 
  const timerRef = useRef(null);
  const correctSound = useMemo(() => new Audio(correctSoundFile), []);
  const incorrectSound = useMemo(() => new Audio(incorrectSoundFile), []);

  const question = questions[currentQuestion];

  const answers = useMemo(() => {
    if (!question) return [];
    let arr = [...question.incorrect_answers, question.correct_answer];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [question]);

  
  const processChoice = useCallback((ans) => {
    if (answered) return; 
    setAnswered(true);
    
    
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = ans === question?.correct_answer;

    if (isCorrect) {
      setFeedback("correct");
      correctSound.currentTime = 0; 
      correctSound.play().catch(e => console.log("Audio play blocked"));
    } else {
      setFeedback("incorrect");
      incorrectSound.currentTime = 0; 
      incorrectSound.play().catch(e => console.log("Audio play blocked"));
    }

    
    setTimeout(() => {
      handleAnswer(ans);
    }, 1000);
  }, [answered, question, handleAnswer, correctSound, incorrectSound]);

  useEffect(() => {
    setAnswered(false);
    setFeedback("");
    setTime(15);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          processChoice(null); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, processChoice]); 

  if (!question) return <p>Loading...</p>;

  return (
    <div className={`quiz-container ${feedback === "correct" ? "animate-correct" : feedback === "incorrect" ? "animate-incorrect" : ""}`}>
      <h3>Question {currentQuestion + 1} of {questions.length}</h3>
      <h2 dangerouslySetInnerHTML={{ __html: question.question }} />
      <p>Time Left: {time}s</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => processChoice(ans)}
            disabled={answered}
            style={{ padding: "10px", margin: "0 auto", width: "300px" }}
          >
            <span dangerouslySetInnerHTML={{ __html: ans }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;