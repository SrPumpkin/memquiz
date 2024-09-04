import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index"

interface Question {
    q: string,
    a: string
}

let initialState: Array<Question> = []

if (window.localStorage.getItem('questions') !== null) {
    // @ts-ignore
    initialState = JSON.parse(window.localStorage.getItem('questions'))
}

export const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        addQuestion: (state, data) => {
            state.push(data.payload)

            window.localStorage.setItem("questions", JSON.stringify(state))
        },
        removeQuestion: (state, data) => {
            state.splice(data.payload, 1)

            window.localStorage.setItem("questions", JSON.stringify(state))
        },
        updateQuestion: (state, data) => {
            state[data.payload.index] = {q: data.payload.q, a: data.payload.a}

            window.localStorage.setItem("questions", JSON.stringify(state))
        },
        cleanQuestions: (state) => {
            state.length = 0

            window.localStorage.setItem("questions", JSON.stringify(state))
        }
    }
})

export const {
    addQuestion,
    removeQuestion,
    updateQuestion,
    cleanQuestions,
} = questionsSlice.actions

export const selectRounds = (state: RootState) => state.questions
export default questionsSlice.reducer