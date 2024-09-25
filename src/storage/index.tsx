import {configureStore} from "@reduxjs/toolkit";
import questionsSlice from "./slice/questionsSlice";
import quizSlice from "./slice/quizSlice";
import settingsSlice from "./slice/settingsSlice";

export const storage = configureStore({
    reducer: {
        questions: questionsSlice,
        quiz: quizSlice,
        settings: settingsSlice,
    }
})

export type RootState = ReturnType<typeof storage.getState>
export type AppDispatch = typeof storage.dispatch
export type AppStore = typeof storage