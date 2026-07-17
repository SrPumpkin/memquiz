import { useState } from "react";
import Index from "../Icon";
import { useAppDispatch } from "../../storage/hooks";
import { recordAttempt } from "../../storage/slice/questionsSlice.tsx";

import "./style.css";

interface Props {
    q: string;
    a: string;
    sourceIndex: number;
    position: number;
    questionIndex: number;
    length: number;
    onNext: () => void;
    onAttempt: (correct: boolean, confidence: number) => void;
    onRequeue?: (question: { q: string; a: string }) => void;
}

export default function QuizQuestion({
    q,
    a,
    sourceIndex,
    position,
    questionIndex,
    length,
    onNext,
    onAttempt,
    onRequeue,
}: Props) {
    const [stage, setStage] = useState<"choice" | "confidence" | "answer">("choice");
    const dispatch = useAppDispatch();
    const isActive = questionIndex === position;

    const saveAttempt = (correct: boolean, confidence: number) => {
        if (sourceIndex >= 0) {
            dispatch(recordAttempt({ index: sourceIndex, correct, confidence }));
        }
        onAttempt(correct, confidence);
    };

    const handleRemember = () => {
        setStage("confidence");
    };

    const handleNotRemember = () => {
        saveAttempt(false, 1);
        onRequeue?.({ q, a });
        setStage("answer");
    };

    const handleConfidentYes = () => {
        saveAttempt(true, 5);
        setStage("answer");
    };

    const handleConfidentNo = () => {
        saveAttempt(true, 2);
        onRequeue?.({ q, a });
        setStage("answer");
    };

    const handleNext = () => {
        setStage("choice");
        onNext();
    };

    return (
        <article
            aria-hidden={!isActive}
            className={`quiz-question ${isActive ? "active" : ""}`}
        >
            <div className="quiz-question__stage">
                {stage === "choice" && (
                    <div className="recall-stage">
                        <span className="session-kicker">
                            Recall the answer
                        </span>
                        <div>
                            <h2>{q}</h2>
                            <p>Try to answer from memory before choosing an option.</p>
                        </div>
                        <div className="recall-actions">
                            <button className="recall-button recall-button--positive" onClick={handleRemember} type="button">
                                <span className="recall-button__icon"><Index name="check" /></span>
                                <span>
                                    <b>I remember</b>
                                    <small>Check your confidence</small>
                                </span>
                            </button>
                            <button className="recall-button recall-button--negative" onClick={handleNotRemember} type="button">
                                <span className="recall-button__icon"><Index name="rotate" /></span>
                                <span>
                                    <b>I don’t remember</b>
                                    <small>Reveal and review again later</small>
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {stage === "confidence" && (
                    <div className="confidence-stage">
                        <span className="session-kicker">
                            Confidence check
                        </span>
                        <div>
                            <h2>Are you sure about your answer?</h2>
                            <p>Your confidence helps separate stable recall from a lucky guess.</p>
                        </div>
                        <div className="confidence-actions">
                            <button onClick={handleConfidentYes} type="button">
                                <span><Index name="shield" /></span>
                                <b>Yes, I’m certain</b>
                                <small>High confidence · 5/5</small>
                            </button>
                            <button onClick={handleConfidentNo} type="button">
                                <span><Index name="rotate" /></span>
                                <b>Not completely</b>
                                <small>Low confidence · review again</small>
                            </button>
                        </div>
                    </div>
                )}

                {stage === "answer" && (
                    <div className="answer-stage">
                        <span className="session-kicker">
                            Correct answer
                        </span>
                        <div className="answer-stage__question">{q}</div>
                        <div className="answer-stage__answer">
                            <span>A</span>
                            <p>{a}</p>
                        </div>
                        <button className="primary-button answer-stage__next" onClick={handleNext} type="button">
                            {questionIndex === length - 1 ? "Complete session" : "Next card"}
                        </button>
                    </div>
                )}
            </div>

            <div className="quiz-question__position" aria-hidden="true">
                <span>{String(position + 1).padStart(2, "0")}</span>
                <i />
                <span>{String(length).padStart(2, "0")}</span>
            </div>
        </article>
    );
}
