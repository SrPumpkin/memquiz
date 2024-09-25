
import "./css/quiz-question.css"
import {useState} from "react";

interface Props {
    q: string,
    a: string,
    index: number,
    length: number,
    current: number,
}

export default function QuizQuestion({q, a, index, length, current}: Props) {
    const [answerState, setAnsverState] = useState(false)
    const handleShow = () => {
        setAnsverState(!answerState)
    }

    return(
        <div className={`quiz-question ${current === index ? "active" : ""}`}>
            <div className="quiz-question-block">
                <span className="q">{q}</span>
                <div className="a-block">
                    <span className={`a ${answerState ? "show" : ""}`}>{a}</span>
                </div>
            </div>
            <button className="show-answer" onClick={handleShow}>{answerState ? "Hide answer" : "Show answer"}</button>
        </div>
    )
}