import React, {useRef, useState} from "react"
import Quiz from "./Quiz"
import UI from "../containers/UI"
import Editor from "./Editor"
import {math} from "../utils/mathFun";

import {useAppDispatch, useAppSelector} from "../storage/hooks"
import {addQuestion} from "../storage/slice/questionsSlice"
import {addQuestionQuiz, toggleState} from "../storage/slice/quizSlice";

import "./css/content.css"

export default function Content() {
    const [qValue, setQValue] = useState("")
    const [aValue, setAValue] = useState("")

    const questions = useAppSelector(state => state.questions)
    const quiz = useAppSelector(state => state.quiz)
    const dispatch = useAppDispatch()

    const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (quiz.quiz) return;

        dispatch(addQuestion({q: qValue, a: aValue}))
    }

    const handleStart = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        console.log(quiz.quiz, questions.length)
        if (quiz.quiz || questions.length === 0) return;

        dispatch(toggleState("quiz"))
        dispatch(toggleState("editor"))

        let questionsCopy  = [...questions]
        let quantity = questions.length < 10 ? questions.length - 1 : 9

        for (let i = 0; i <= quantity; i++) {
            let rand = Math.floor(math.rand(0, questionsCopy.length))
            dispatch(addQuestionQuiz(questionsCopy[rand]))
            questionsCopy.splice(rand, 1)
        }
    }

    const handleChangeQ = (data: React.ChangeEvent<HTMLInputElement>) => {
        setQValue(data.target.value)
    }

    const handleChangeA = (data: React.ChangeEvent<HTMLInputElement>) => {
        setAValue(data.target.value)
    }

    return(
        <div className="content">
            <form onSubmit={handleAdd}>
                <div className="input-block">
                    <label htmlFor="q" className={`${quiz.quiz ? "lock" : ""}`}>
                        <span>Q:</span>
                        <input type="text" name="question" id="q" value={qValue} required onChange={handleChangeQ} />
                    </label>
                    <label htmlFor="a" className={`${quiz.quiz ? "lock" : ""}`}>
                        <span>A:</span>
                        <input type="text" name="answer" id="a" value={aValue} required onChange={handleChangeA} />
                    </label>
                </div>
                <div className="btn-block">
                    <div className={`btn ${quiz.quiz ? "lock" : ""}`}>
                        <button type="submit">Add</button>
                        <span>question to quiz</span>
                    </div>
                    <div className={`btn ${quiz.quiz || questions.length === 0 ? "lock" : ""}`}>
                        <button onClick={handleStart}>Start</button>
                        <span>quiz with {questions.length} questions</span>
                    </div>
                </div>
            </form>
            <div className="quiz-data">
                <Quiz />
                <Editor />
                <UI />
            </div>
        </div>
    )
}