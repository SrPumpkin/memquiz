import "./style.css";

import type { CSSProperties } from "react";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { closeData } from "../../storage/slice/quizSlice.tsx";

import {
    calculateLearningStatistics,
    getQuestionMastery,
} from "../../utils/statistics.ts";

import AnimatedNumber from "../../components/AnimatedNumber";
import Icon from "../../components/Icon";

type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number>;

export default function Statistics() {
    const questions = useAppSelector((state) => state.questions);
    const isOpen = useAppSelector((state) => state.quiz.results);
    const dispatch = useAppDispatch();
    const stats = calculateLearningStatistics(questions);
    const maxActivity = Math.max(...stats.activity.map((point) => point.attempts), 1);
    const distributionTotal = Math.max(stats.totalQuestions, 1);
    const difficultQuestions = [...questions]
        .filter((question) => question.correctCount + question.wrongCount > 0)
        .sort((a, b) => {
            const masteryDifference = getQuestionMastery(a) - getQuestionMastery(b);
            return masteryDifference || b.wrongCount - a.wrongCount;
        })
        .slice(0, 4);

    return (
        <div
            aria-hidden={!isOpen}
            className={`data-overlay statistics-overlay ${isOpen ? "active" : ""}`}
        >
            <section
                aria-labelledby="statistics-title"
                aria-modal="true"
                className="data-window statistics-window"
                role="dialog"
            >
                <header className="data-window__header">
                    <div>
                        <span className="eyebrow">Learning telemetry</span>
                        <h2 id="statistics-title">Statistics</h2>
                    </div>
                    <button
                        aria-label="Close statistics"
                        className="icon-button"
                        onClick={() => dispatch(closeData())}
                        type="button"
                    >
                        <Icon name="x" />
                    </button>
                </header>

                <div className="statistics-window__body">
                    <div className="statistics-hero">
                        <article className="accuracy-dial">
                            <svg viewBox="0 0 160 160" aria-hidden="true">
                                <circle className="accuracy-dial__track" cx="80" cy="80" r="62" pathLength="100" />
                                <circle
                                    className="accuracy-dial__value"
                                    cx="80"
                                    cy="80"
                                    r="62"
                                    pathLength="100"
                                    strokeDasharray={`${stats.accuracy} 100`}
                                />
                            </svg>
                            <div className="accuracy-dial__copy">
                                <strong><AnimatedNumber value={stats.accuracy} suffix="%" /></strong>
                                <span>recall rate</span>
                            </div>
                        </article>

                        <div className="statistics-kpis">
                            <article>
                                <span className="statistics-kpis__icon statistics-kpis__icon--violet">
                                    <Icon name="activity" />
                                </span>
                                <div>
                                    <span>Total attempts</span>
                                    <strong><AnimatedNumber value={stats.totalAttempts} /></strong>
                                </div>
                            </article>
                            <article>
                                <span className="statistics-kpis__icon statistics-kpis__icon--green">
                                    <Icon name="shield" />
                                </span>
                                <div>
                                    <span>Mastered</span>
                                    <strong><AnimatedNumber value={stats.mastered} /></strong>
                                </div>
                            </article>
                            <article>
                                <span className="statistics-kpis__icon statistics-kpis__icon--gold">
                                    <Icon name="target" />
                                </span>
                                <div>
                                    <span>Confidence</span>
                                    <strong>
                                        <AnimatedNumber value={stats.averageConfidence} decimals={1} suffix=" / 5" />
                                    </strong>
                                </div>
                            </article>
                            <article>
                                <span className="statistics-kpis__icon statistics-kpis__icon--rose">
                                    <Icon name="clock" />
                                </span>
                                <div>
                                    <span>Active streak</span>
                                    <strong><AnimatedNumber value={stats.activeDayStreak} suffix=" d" /></strong>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="statistics-grid">
                        <article className="analytics-card activity-chart-card">
                            <div className="analytics-card__header">
                                <div>
                                    <span className="eyebrow">Last 7 days</span>
                                    <h3>Review activity</h3>
                                </div>
                                <span className="analytics-card__badge">
                                    {stats.activity.reduce((sum, point) => sum + point.attempts, 0)} reviews
                                </span>
                            </div>
                            <div className="activity-chart" aria-label="Attempts during the last seven days">
                                {stats.activity.map((point, Icon) => {
                                    const totalHeight = Math.max((point.attempts / maxActivity) * 100, 4);
                                    const correctHeight = point.attempts === 0
                                        ? 0
                                        : (point.correct / point.attempts) * totalHeight;

                                    return (
                                        <div className="activity-chart__column" key={point.dateKey}>
                                            <div className="activity-chart__value">
                                                <span
                                                    className="activity-chart__bar"
                                                    style={{
                                                        "--height": `${totalHeight}%`,
                                                        "--correct-height": `${correctHeight}%`,
                                                        "--delay": `${Icon * 65}ms`,
                                                    } as StyleWithVariables}
                                                >
                                                    <i />
                                                </span>
                                            </div>
                                            <span>{point.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>

                        <article className="analytics-card distribution-card">
                            <div className="analytics-card__header">
                                <div>
                                    <span className="eyebrow">Library health</span>
                                    <h3>Mastery distribution</h3>
                                </div>
                            </div>
                            <div className="distribution-track" aria-hidden="true">
                                <span
                                    className="distribution-track__mastered"
                                    style={{ "--segment": `${(stats.mastered / distributionTotal) * 100}%` } as StyleWithVariables}
                                />
                                <span
                                    className="distribution-track__learning"
                                    style={{ "--segment": `${(stats.learning / distributionTotal) * 100}%` } as StyleWithVariables}
                                />
                                <span
                                    className="distribution-track__new"
                                    style={{ "--segment": `${(stats.untouched / distributionTotal) * 100}%` } as StyleWithVariables}
                                />
                            </div>
                            <div className="distribution-list">
                                <div>
                                    <span><i className="dot dot--green" />Mastered</span>
                                    <strong>{stats.mastered}</strong>
                                </div>
                                <div>
                                    <span><i className="dot dot--gold" />Learning</span>
                                    <strong>{stats.learning}</strong>
                                </div>
                                <div>
                                    <span><i className="dot dot--violet" />New</span>
                                    <strong>{stats.untouched}</strong>
                                </div>
                            </div>
                        </article>

                        <article className="analytics-card difficult-card">
                            <div className="analytics-card__header">
                                <div>
                                    <span className="eyebrow">Priority queue</span>
                                    <h3>Cards that need attention</h3>
                                </div>
                            </div>

                            {difficultQuestions.length > 0 ? (
                                <ol className="difficult-list">
                                    {difficultQuestions.map((question, Icon) => {
                                        const mastery = getQuestionMastery(question);
                                        return (
                                            <li key={`${question.q}-${Icon}`}>
                                                <span className="difficult-list__Icon">{String(Icon + 1).padStart(2, "0")}</span>
                                                <div className="difficult-list__copy">
                                                    <strong>{question.q}</strong>
                                                    <span>{question.correctCount + question.wrongCount} attempts</span>
                                                </div>
                                                <div className="difficult-list__meter">
                                                    <span style={{ "--mastery": `${mastery}%` } as StyleWithVariables} />
                                                </div>
                                                <b>{mastery}%</b>
                                            </li>
                                        );
                                    })}
                                </ol>
                            ) : (
                                <div className="analytics-empty">
                                    <Icon name="activity" size={22} />
                                    <div>
                                        <strong>No review data yet</strong>
                                        <span>Complete a quiz to populate your learning telemetry.</span>
                                    </div>
                                </div>
                            )}
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
}
