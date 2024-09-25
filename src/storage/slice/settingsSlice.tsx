import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index"

interface Settings {
    amountQuestion: number
}

let initialState: Settings = {
    amountQuestion: 0
}

if (window.localStorage.getItem('settings') !== null) {
    // @ts-ignore
    initialState = JSON.parse(window.localStorage.getItem('settings'))
} else if (window.localStorage.getItem('questions') !== null) {
    // @ts-ignore
    initialState.amountQuestion = JSON.parse(window.localStorage.getItem('questions')).length
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setAmountQuestion: (state, data: {payload: number}) => {
            state.amountQuestion = data.payload
            window.localStorage.setItem('settings', JSON.stringify(state))
        }
    }
})

export const {
    setAmountQuestion,
} = settingsSlice.actions

export const settings = (state: RootState) => state.settings
export default settingsSlice.reducer