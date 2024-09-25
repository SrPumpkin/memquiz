import React from "react";
import {useAppDispatch, useAppSelector} from "../storage/hooks";
import {addQuestion} from "../storage/slice/questionsSlice";
import {addQuestionQuiz, toggleQuiz} from "../storage/slice/quizSlice";
import {math} from "../utils/mathFun";

import "./css/question-form.css"
import {setAmountQuestion} from "../storage/slice/settingsSlice";

export default function QuestionForm() {
    const questions = useAppSelector(state => state.questions)
    const quiz = useAppSelector(state => state.quiz)
    const settings = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (quiz.quiz) return;

        const formData = new FormData(event.currentTarget)
        const fields = Object.fromEntries(formData)

        if (settings.amountQuestion === 0) dispatch(setAmountQuestion(1))
        dispatch(addQuestion({q: fields.question, a: fields.answer}))
        event.currentTarget.reset()
    }

    const handleStart = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()

        if (quiz.quiz || questions.length === 0) return;

        dispatch(toggleQuiz())

        let questionsCopy  = [...questions]
        let quantity = settings.amountQuestion

        for (let i = 0; i <= quantity - 1; i++) {
            let rand = Math.floor(math.rand(0, questionsCopy.length))
            dispatch(addQuestionQuiz(questionsCopy[rand]))
            questionsCopy.splice(rand, 1)
        }
    }

    return(
        <form onSubmit={handleAdd}>
            <div className="input-block">
                <label htmlFor="q" className={`${quiz.quiz ? "lock" : ""}`}>
                    <span>Q:</span>
                    <input type="text" name="question" id="q" required />
                </label>
                <label htmlFor="a" className={`${quiz.quiz ? "lock" : ""}`}>
                    <span>A:</span>
                    <input type="text" name="answer" id="a" required />
                </label>
            </div>
            <div className="btn-block">
                <div className={`btn ${quiz.quiz ? "lock" : ""}`}>
                    <button type="submit">Add</button>
                    <span>question to quiz</span>
                </div>
                <div className={`btn ${quiz.quiz || questions.length === 0 ? "lock" : ""}`}>
                    <button onClick={handleStart}>Start</button>
                    <span>quiz with {settings.amountQuestion} questions</span>
                </div>
            </div>
        </form>
    )
}