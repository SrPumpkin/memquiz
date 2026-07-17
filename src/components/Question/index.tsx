import "./style.css";

import { useEffect, useState, type CSSProperties } from "react";

import { getQuestionMastery } from "../../utils/statistics.ts";

import Icon from "../Icon";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { removeQuestion, updateQuestion } from "../../storage/slice/questionsSlice.tsx";
import { setAmountQuestion } from "../../storage/slice/settingsSlice.tsx";

type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number>;

interface Props {
    question: string;
    answer: string;
    index: number;
}

export default function Question({ question, answer, index }: Props) {
    const [editorState, setEditorState] = useState(false);
    const [draftQuestion, setDraftQuestion] = useState(question);
    const [draftAnswer, setDraftAnswer] = useState(answer);
    const allQuestions = useAppSelector((state) => state.questions);
    const settings = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setDraftQuestion(question);
        setDraftAnswer(answer);
    }, [answer, question]);

    const handleEdit = () => {
        setDraftQuestion(question);
        setDraftAnswer(answer);
        setEditorState(true);
    };

    const handleRemove = () => {
        dispatch(removeQuestion(index));
        if (settings.amountQuestion >= allQuestions.length) {
            dispatch(setAmountQuestion(settings.amountQuestion - 1));
        }
    };

    const handleSave = () => {
        const nextQuestion = draftQuestion.trim();
        const nextAnswer = draftAnswer.trim();

        if (!nextQuestion || !nextAnswer) return;

        dispatch(
            updateQuestion({
                index,
                q: nextQuestion,
                a: nextAnswer,
            })
        );
        setEditorState(false);
    };

    const q = allQuestions[index];
    if (!q) return null;

    const totalAttempts = q.correctCount + q.wrongCount;
    const mastery = getQuestionMastery(q);
    const masteryTone = totalAttempts === 0
        ? "new"
        : mastery >= 70
            ? "strong"
            : mastery >= 40
                ? "learning"
                : "weak";
    const lastReviewed = q.lastReviewed
        ? new Date(q.lastReviewed).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
        })
        : "Not reviewed";
    const recentHistory = q.history.slice(-8);

    return (
        <article className={`question-card question-card--${masteryTone} ${editorState ? "question-card--editing" : ""}`}>
            <div className="question-card__number">{String(index + 1).padStart(2, "0")}</div>

            <div className="question-card__content">
                {editorState ? (
                    <div className="question-card__editor">
                        <label>
                            <span>Question</span>
                            <textarea
                                autoFocus
                                onChange={(event) => setDraftQuestion(event.target.value)}
                                rows={2}
                                value={draftQuestion}
                            />
                        </label>
                        <label>
                            <span>Answer</span>
                            <textarea
                                onChange={(event) => setDraftAnswer(event.target.value)}
                                rows={3}
                                value={draftAnswer}
                            />
                        </label>
                    </div>
                ) : (
                    <>
                        <div className="question-card__question">
                            <span className="question-card__tag">Question</span>
                            <h3>{q.q}</h3>
                        </div>
                        <div className="question-card__answer">
                            <span className="question-card__tag">Answer</span>
                            <p>{q.a}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="question-card__analytics">
                <div
                    className="mastery-gauge"
                    style={{ "--mastery": `${mastery}%` } as StyleWithVariables}
                >
                    <svg viewBox="0 0 52 52" aria-hidden="true">
                        <circle cx="26" cy="26" r="21" pathLength="100" />
                        <circle cx="26" cy="26" r="21" pathLength="100" strokeDasharray={`${mastery} 100`} />
                    </svg>
                    <strong>{mastery}%</strong>
                </div>

                <div className="question-card__stats">
                    <span><b>{totalAttempts}</b> attempts</span>
                    <span><b>{q.correctCount}</b> recalled</span>
                    <span><b>{lastReviewed}</b> last review</span>
                </div>

                <div className="history-pulse" aria-label={`${recentHistory.length} recent attempts`}>
                    {recentHistory.length > 0 ? recentHistory.map((attempt, historyIndex) => (
                        <i
                            className={attempt.correct ? "history-pulse__correct" : "history-pulse__wrong"}
                            key={`${attempt.date}-${historyIndex}`}
                            title={attempt.correct ? "Recalled" : "Missed"}
                        />
                    )) : <span>Awaiting first review</span>}
                </div>
            </div>

            <div className="question-card__actions">
                {editorState ? (
                    <>
                        <button
                            aria-label="Save changes"
                            className="icon-button icon-button--confirm"
                            disabled={!draftQuestion.trim() || !draftAnswer.trim()}
                            onClick={handleSave}
                            type="button"
                        >
                            <Icon name="check" />
                        </button>
                        <button
                            aria-label="Cancel editing"
                            className="icon-button"
                            onClick={() => setEditorState(false)}
                            type="button"
                        >
                            <Icon name="x" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            aria-label={`Edit question ${index + 1}`}
                            className="icon-button"
                            onClick={handleEdit}
                            type="button"
                        >
                            <Icon name="edit" />
                        </button>
                        <button
                            aria-label={`Delete question ${index + 1}`}
                            className="icon-button icon-button--danger"
                            onClick={handleRemove}
                            type="button"
                        >
                            <Icon name="trash" />
                        </button>
                    </>
                )}
            </div>
        </article>
    );
}
