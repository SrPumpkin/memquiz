import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index"

interface Questions {
    q: string,
    a: string,
}

interface Quiz {
    quiz: boolean,
    results: boolean,
    editor: boolean,
    info: boolean,
    settings: boolean,
    curQuestion: number,
    questions: Array<Questions>,
}

let initialState: Quiz = {
    quiz: false,
    results: false,
    editor: true,
    info: false,
    settings: false,
    curQuestion: 0,
    questions: [],
}

export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        addQuestionQuiz: (state, data: {payload: Questions}) => {
            state.questions.push(data.payload)
        },
        clearQuestionQuiz: (state) => {
            state.questions.length = 0
        },
        toggleQuiz: (state) => {
            state.quiz = !state.quiz
            state.editor = !state.editor
        },
        toggleState: (state, data: {payload: string}) => {
            switch (data.payload) {
                case "results":
                    state.info = false
                    state.settings = false
                    state.results = !state.results
                    break;
                case "info":
                    state.results = false
                    state.settings = false
                    state.info = !state.info
                    break;
                case "settings":
                    state.results = false
                    state.info = false
                    state.settings = !state.settings
                    break;
            }
        },
        closeData: (state) => {
            state.results = false
            state.info = false
            state.settings = false
        },
        setCurQuestion: (state, data: {payload: number}) => {
            state.curQuestion = data.payload
        },
    }
})

export const {
    addQuestionQuiz,
    clearQuestionQuiz,
    toggleQuiz,
    toggleState,
    closeData,
    setCurQuestion,
} = quizSlice.actions

export const quiz = (state: RootState) => state.quiz
export default quizSlice.reducer