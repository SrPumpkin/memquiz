import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import {QuestionProps} from "./questionsSlice.tsx";

/**
 * State shape for the quiz feature.
 */
interface Quiz {
    /** Whether the quiz mode is currently active */
    quiz: boolean;

    /** Whether the results panel is open */
    results: boolean;

    /** Whether the editor (question list) is active */
    editor: boolean;

    /** Whether the info/about panel is open */
    info: boolean;

    /** Whether the settings panel is open */
    settings: boolean;

    /** Index of the currently displayed question in the quiz */
    curQuestion: number;

    /** List of questions in the current quiz session */
    questions: QuestionProps[];
}

let initialState: Quiz = {
    quiz: false,
    results: false,
    editor: true,
    info: false,
    settings: false,
    curQuestion: 0,
    questions: [],
};

export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        /**
         * Adds a question to the current quiz session.
         */
        addQuestionQuiz: (state, action: PayloadAction<QuestionProps>) => {
            state.questions.push(action.payload);
        },

        /**
         * Clears all questions from the current quiz session.
         */
        clearQuestionQuiz: (state) => {
            state.questions.length = 0;
        },

        /**
         * Toggles between Quiz mode and Editor mode.
         */
        toggleQuiz: (state) => {
            state.quiz = !state.quiz;
            state.editor = !state.editor;
        },

        /**
         * Toggles visibility of different panels.
         */
        toggleState: (state, action: PayloadAction<
            /** Name of the panel to toggle ("info" | "settings" | "results") */
            string
        >) => {
            switch (action.payload) {
                case "results":
                    state.info = false;
                    state.settings = false;
                    state.results = !state.results;
                    break;
                case "info":
                    state.results = false;
                    state.settings = false;
                    state.info = !state.info;
                    break;
                case "settings":
                    state.results = false;
                    state.info = false;
                    state.settings = !state.settings;
                    break;
            }
        },

        /**
         * Closes all overlay panels (Info, Settings, Results).
         */
        closeData: (state) => {
            state.results = false;
            state.info = false;
            state.settings = false;
        },

        /**
         * Sets the index of the currently active question.
         */
        setCurQuestion: (state, action: PayloadAction<
            /** New current question index */
            number
        >) => {
            state.curQuestion = action.payload;
        },

        /**
         * Adds a question back to the end of the current quiz queue.
         * Used for delayed re-test.
         */
        requeueQuestion: (state, action: PayloadAction<
            /** The question to re-add to the session */
            QuestionProps
        >) => {
            state.questions.push(action.payload);
        },
    },
});

export const {
    addQuestionQuiz,
    clearQuestionQuiz,
    toggleQuiz,
    toggleState,
    closeData,
    setCurQuestion,
    requeueQuestion,
} = quizSlice.actions;

export const quiz = (state: RootState) => state.quiz;
export default quizSlice.reducer;
