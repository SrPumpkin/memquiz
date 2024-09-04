import Question from "../components/Question";
import React from "react";
import {useAppSelector} from "../storage/hooks";

import "./css/editor.css"

export default function Editor() {
    const questions = useAppSelector(state => state.questions)
    const quiz = useAppSelector(state => state.quiz)

    return(
        <ul className={`editor ${quiz.editor ? "active" : ""}`}>
            {questions.map((q, i) => <li className="quiz-block" key={i}><Question question={q.q} answer={q.a} index={i}/></li>)}
        </ul>
    )
}