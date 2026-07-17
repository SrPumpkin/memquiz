import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

/**
 * Represents a single question in the quiz system.
 * Contains both the question data and learning statistics.
 */
export interface QuestionProps {
    /** The question text */
    q: string;

    /** The correct answer to the question */
    a: string;

    /**
     * History of all attempts for this question.
     * Each entry stores the date, whether the user remembered it, and their confidence level.
     */
    history: Array<{
        /** Timestamp of the attempt in ISO format */
        date: string;
        /** Whether the user remembered the answer (true = remembered, false = did not remember) */
        correct: boolean;
        /** User's self-reported confidence level (1-5) */
        confidence: number;
    }>;

    /** Total number of times the user answered incorrectly */
    wrongCount: number;

    /** Total number of times the user answered correctly */
    correctCount: number;

    /** Date of the last review (ISO format) */
    lastReviewed?: string;
}

let initialState: QuestionProps[] = [];

if (window.localStorage.getItem("questions") !== null) {
    const saved: Array<Partial<QuestionProps>> = JSON.parse(
        window.localStorage.getItem("questions")!
    );

    // Migration for existing users (backward compatibility)
    initialState = saved.map((item) => ({
        q: item.q ?? "",
        a: item.a ?? "",
        history: item.history || [],
        wrongCount: item.wrongCount ?? 0,
        correctCount: item.correctCount ?? 0,
        lastReviewed: item.lastReviewed,
    }));
}

export const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        /**
         * Adds a new question to the list.
         * Initializes empty history and zeroed counters.
         */
        addQuestion: (state, action: PayloadAction<{ q: string; a: string }>) => {
            const newQuestion: QuestionProps = {
                q: action.payload.q,
                a: action.payload.a,
                history: [],
                wrongCount: 0,
                correctCount: 0,
            };
            state.push(newQuestion);
            window.localStorage.setItem("questions", JSON.stringify(state));
        },

        /**
         * Removes a question by its index in the array.
         * Updates localStorage after removal.
         */
        removeQuestion: (state, action: PayloadAction<number>) => {
            state.splice(action.payload, 1);
            window.localStorage.setItem("questions", JSON.stringify(state));
        },

        /**
         * Updates the question text and answer at a specific index.
         * Used when editing questions via contentEditable.
         */
        updateQuestion: (
            state,
            action: PayloadAction<{ index: number; q: string; a: string }>
        ) => {
            const { index, q, a } = action.payload;
            state[index] = {
                ...state[index],
                q,
                a,
            };
            window.localStorage.setItem("questions", JSON.stringify(state));
        },

        /**
         * Records the result of a quiz attempt for a specific question.
         * Updates history, correct/wrong counters, and last reviewed date.
         */
        recordAttempt: (
            state,
            action: PayloadAction<{
                /** Index of the question in the array */
                index: number;
                /** Whether the user remembered the answer */
                correct: boolean;
                /** User's confidence level (1-5) */
                confidence: number;
            }>
        ) => {
            const { index, correct, confidence } = action.payload;
            const question = state[index];

            if (!question) return;

            const now = new Date().toISOString();

            // Add new attempt to history
            question.history.push({
                date: now,
                correct,
                confidence,
            });

            // Update counters
            if (correct) {
                question.correctCount += 1;
            } else {
                question.wrongCount += 1;
            }

            question.lastReviewed = now;

            window.localStorage.setItem("questions", JSON.stringify(state));
        },

        /**
         * Deletes all questions from the store.
         * Used by the "Clean all" button.
         */
        cleanQuestions: (state) => {
            state.length = 0;
            window.localStorage.setItem("questions", JSON.stringify(state));
        },
    },
});

export const {
    addQuestion,
    removeQuestion,
    updateQuestion,
    recordAttempt,
    cleanQuestions,
} = questionsSlice.actions;

export const selectQuestions = (state: RootState) => state.questions;
export default questionsSlice.reducer;
