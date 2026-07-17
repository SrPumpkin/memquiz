import "./style.css";

import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import {addQuestion, QuestionProps} from "../../storage/slice/questionsSlice.tsx";
import { addQuestionQuiz, toggleQuiz } from "../../storage/slice/quizSlice.tsx";
import { setAmountQuestion } from "../../storage/slice/settingsSlice.tsx";

import Icon from "../../components/Icon";

export default function QuestionForm() {
    const [error, setError] = useState("");
    const questions = useAppSelector((state) => state.questions);
    const quiz = useAppSelector((state) => state.quiz);
    const settings = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

    const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (quiz.quiz) return;

        const formData = new FormData(event.currentTarget);

        const question = formData.get("question") as string;
        const answer = formData.get("answer") as string;

        if (!question.trim() || !answer.trim()) {
            setError("Add both a prompt and an answer before saving the card.");
            return;
        }

        if (settings.amountQuestion === 0) {
            dispatch(setAmountQuestion(1));
        }

        dispatch(addQuestion({ q: question.trim(), a: answer.trim() }));
        setError("");
        event.currentTarget.reset();
    };

    const handleStart = () => {
        if (quiz.quiz || questions.length === 0) return;

        dispatch(toggleQuiz());

        const quantity = settings.amountQuestion;
        let questionsCopy = [...questions];

        questionsCopy.sort((a, b) => {
            const scoreA = a.wrongCount - a.correctCount;
            const scoreB = b.wrongCount - b.correctCount;
            return scoreB - scoreA;
        });

        const selectedQuestions: QuestionProps[] = [];

        for (let i = 0; i < quantity && questionsCopy.length > 0; i++) {
            const maxIcon = Math.min(3, questionsCopy.length);
            const randomIcon = Math.floor(Math.random() * maxIcon);

            const selected = questionsCopy.splice(randomIcon, 1)[0];
            selectedQuestions.push(selected);
        }

        selectedQuestions.sort(() => Math.random() - 0.5);

        selectedQuestions.forEach((q) => {
            dispatch(addQuestionQuiz(q));
        });
    };

    return(
        <aside className="composer-panel">
            <div className="composer-panel__heading">
                <div>
                    <span className="eyebrow">Card composer</span>
                    <h2>Create a memory card</h2>
                </div>
                <span className="composer-panel__Icon">Q/A</span>
            </div>

            <form className="composer-form" onSubmit={handleAdd}>
                <label className="composer-field" htmlFor="question-input">
                    <span className="composer-field__label">
                        <b>Q</b>
                        Question
                    </span>
                    <textarea
                        disabled={quiz.quiz}
                        id="question-input"
                        name="question"
                        placeholder="What do you want to remember?"
                        required
                        rows={3}
                    />
                </label>

                <label className="composer-field" htmlFor="answer-input">
                    <span className="composer-field__label">
                        <b>A</b>
                        Answer
                    </span>
                    <textarea
                        disabled={quiz.quiz}
                        id="answer-input"
                        name="answer"
                        placeholder="Add a concise, memorable answer"
                        required
                        rows={4}
                    />
                </label>

                {error && (
                    <p className="composer-form__error" role="alert">
                        {error}
                    </p>
                )}

                <button className="primary-button composer-form__submit" disabled={quiz.quiz} type="submit">
                    <Icon name="plus" />
                    Add to library
                </button>
            </form>

            <div className="session-launcher">
                <div className="session-launcher__header">
                    <div>
                        <span className="eyebrow">Adaptive session</span>
                        <h3>Start recall</h3>
                    </div>
                    <strong>{settings.amountQuestion}</strong>
                </div>

                <p>
                    Prioritizes cards with the weakest recall history, then shuffles the session.
                </p>

                <div className="session-launcher__meta">
                    <span><Icon name="cards" size={15} />{settings.amountQuestion} cards</span>
                    <span><Icon name="activity" size={15} />Adaptive order</span>
                </div>

                <button
                    className="session-launcher__button"
                    disabled={quiz.quiz || questions.length === 0}
                    onClick={handleStart}
                    type="button"
                >
                    <span>Begin session</span>
                    <Icon name="play" />
                </button>

                {questions.length === 0 && (
                    <span className="session-launcher__hint">Add your first card to unlock a session.</span>
                )}
            </div>

            <div className="local-note">
                <Icon name="database" size={16} />
                <span>Your library and review history stay in this browser.</span>
            </div>
        </aside>
    );
}
