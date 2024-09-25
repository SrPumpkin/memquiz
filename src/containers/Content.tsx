import React from "react"

import Quiz from "./Quiz"
import UI from "./UI"
import Editor from "./Editor"
import Info from "./Info"
import QuestionForm from "./QuestionForm";
import Settings from "./Settings"

import "./css/content.css"

export default function Content() {
    return(
        <div className="content">
            <QuestionForm />
            <div className="quiz-data">
                <div className="quiz-block">
                    <Quiz />
                    <Editor />
                    <Info />
                    <Settings />
                </div>
                <UI />
            </div>
        </div>
    )
}