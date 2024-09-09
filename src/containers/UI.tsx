import React from "react";
import {useAppDispatch, useAppSelector} from "../storage/hooks";
import {cleanQuestions} from "../storage/slice/questionsSlice";
import {clearQuestionQuiz, setCurQuestion, toggleState} from "../storage/slice/quizSlice";

import "./css/ui.css"

export default function UI() {
    const quiz = useAppSelector(state => state.quiz)
    const dispatch = useAppDispatch()

    const handleStop = () => {
        dispatch(clearQuestionQuiz())
        dispatch(toggleState("quiz"))
        dispatch(toggleState("editor"))
        dispatch(setCurQuestion(0))
    }

    const handleNext = () => {
        dispatch(setCurQuestion(quiz.curQuestion + 1))
        if (quiz.questions.length === quiz.curQuestion + 1) handleStop()
    }

    const handleClean = () => {
        dispatch(cleanQuestions())
    }

    const handleClose = () => {
        dispatch(toggleState("results"))
    }

    const handleInfoUi = () => {
        dispatch(toggleState("info"))
    }

    return(
        <div className="ui">
            <div className={`quiz-ui ${quiz.quiz && "active"}`}>
                <button className="show" onClick={handleStop}>Stop quiz</button>
                <button className="next" onClick={handleNext}>{quiz.questions.length === quiz.curQuestion + 1 ? "Finish quiz" : "Next Question"}</button>
            </div>
            <div className={`editor-ui ${quiz.editor && "active"}`}>
                <button className="clean" onClick={handleClean}>Clean all</button>
            </div>
            <div className={`results-ui ${quiz.results && "active"}`}>
                <button className="close" onClick={handleClose}>Close</button>
            </div>
            <div className={`info-ui ${quiz.info && "active"}`}>
                <button className="close" onClick={handleInfoUi}>Close</button>
            </div>
        </div>
    )
}