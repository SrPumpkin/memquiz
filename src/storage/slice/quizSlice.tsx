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
    curQuestion: number,
    questions: Array<Questions>,
}

let initialState: Quiz = {
    quiz: false,
    results: false,
    editor: true,
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
        toggleState: (state, data: {payload: string}) => {
            switch (data.payload) {
                case "quiz":
                    state.quiz = !state.quiz
                    break;
                case "results":
                    state.results = !state.results
                    break;
                case "editor":
                    state.editor = !state.editor
                    break;
            }
        },
        setCurQuestion: (state, data: {payload: number}) => {
            state.curQuestion = data.payload
        }
    }
})

export const {
    addQuestionQuiz,
    clearQuestionQuiz,
    toggleState,
    setCurQuestion,
} = quizSlice.actions

export const selectRounds = (state: RootState) => state.quiz
export default quizSlice.reducer