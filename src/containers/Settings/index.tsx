import "./style.css";

import React, { type CSSProperties } from "react";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { closeData } from "../../storage/slice/quizSlice.tsx";
import { setAmountQuestion } from "../../storage/slice/settingsSlice.tsx";

import Icon from "../../components/Icon";

type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number>;

export default function Settings() {
    const questions = useAppSelector((state) => state.questions);
    const quiz = useAppSelector((state) => state.quiz);
    const settings = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAmountQuestion(Number(event.target.value)));
    };

    const progress = questions.length === 0
        ? 0
        : ((settings.amountQuestion - 1) / Math.max(questions.length - 1, 1)) * 100;

    return (
        <div aria-hidden={!quiz.settings} className={`data-overlay settings-overlay ${quiz.settings ? "active" : ""}`}>
            <section
                aria-labelledby="settings-title"
                aria-modal="true"
                className="data-window settings-window"
                role="dialog"
            >
                <header className="data-window__header">
                    <div>
                        <span className="eyebrow">Session controls</span>
                        <h2 id="settings-title">Settings</h2>
                    </div>
                    <button
                        aria-label="Close settings"
                        className="icon-button"
                        onClick={() => dispatch(closeData())}
                        type="button"
                    >
                        <Icon name="x" />
                    </button>
                </header>

                <div className="settings-window__body">
                    <article className="session-size-setting">
                        <div className="session-size-setting__header">
                            <span className="session-size-setting__icon"><Icon name="cards" /></span>
                            <div>
                                <h3>Cards per session</h3>
                                <p>Choose how many cards MemQuiz should pull into each recall session.</p>
                            </div>
                            <output htmlFor="session-size">{settings.amountQuestion}</output>
                        </div>

                        <div className="range-control">
                            <input
                                aria-label="Cards per session"
                                className="amount-input"
                                disabled={questions.length === 0}
                                id="session-size"
                                max={questions.length}
                                min={questions.length === 0 ? 0 : 1}
                                name="amount"
                                onChange={handleRangeChange}
                                step="1"
                                style={{ "--range-progress": `${progress}%` } as StyleWithVariables}
                                type="range"
                                value={settings.amountQuestion}
                            />
                            <div className="range-control__labels">
                                <span>{questions.length === 0 ? 0 : 1}</span>
                                <span>{questions.length} available</span>
                            </div>
                        </div>
                    </article>

                    <div className="settings-insight">
                        <Icon name="activity" />
                        <div>
                            <strong>Adaptive selection stays enabled</strong>
                            <p>
                                Cards with more missed attempts receive a higher priority before the selected set is shuffled.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
