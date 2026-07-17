import "./style.css";

import type { CSSProperties } from "react";

import { useAppSelector } from "../../storage/hooks";

import { calculateLearningStatistics } from "../../utils/statistics.ts";

import Icon from "../../components/Icon";
import AnimatedNumber from "../../components/AnimatedNumber";

type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number>;

export default function LearningOverview() {
    const questions = useAppSelector((state) => state.questions);
    const stats = calculateLearningStatistics(questions);
    const maxActivity = Math.max(...stats.activity.map((point) => point.attempts), 1);
    const masteryPercent = stats.totalQuestions === 0
        ? 0
        : Math.round((stats.mastered / stats.totalQuestions) * 100);

    return (
        <section className="learning-overview" aria-label="Learning overview">
            <article className="overview-card overview-card--accuracy">
                <div className="overview-card__icon overview-card__icon--success">
                    <Icon name="target" />
                </div>
                <div className="overview-card__copy">
                    <span className="overview-card__label">Recall accuracy</span>
                    <strong><AnimatedNumber value={stats.accuracy} suffix="%" /></strong>
                    <span className="overview-card__meta">
                        {stats.correctAttempts} correct of {stats.totalAttempts} attempts
                    </span>
                </div>
                <svg className="overview-ring" viewBox="0 0 44 44" aria-hidden="true">
                    <circle className="overview-ring__track" cx="22" cy="22" r="18" pathLength="100" />
                    <circle
                        className="overview-ring__value"
                        cx="22"
                        cy="22"
                        r="18"
                        pathLength="100"
                        strokeDasharray={`${stats.accuracy} 100`}
                    />
                </svg>
            </article>

            <article className="overview-card">
                <div className="overview-card__icon">
                    <Icon name="activity" />
                </div>
                <div className="overview-card__copy">
                    <span className="overview-card__label">Review activity</span>
                    <strong><AnimatedNumber value={stats.totalAttempts} /></strong>
                    <span className="overview-card__meta">All recorded attempts</span>
                </div>
                <div className="overview-spark" aria-hidden="true">
                    {stats.activity.map((point, index) => (
                        <span
                            key={point.dateKey}
                            style={{
                                "--bar-height": `${Math.max((point.attempts / maxActivity) * 100, 10)}%`,
                                "--bar-delay": `${index * 45}ms`,
                            } as StyleWithVariables}
                        />
                    ))}
                </div>
            </article>

            <article className="overview-card">
                <div className="overview-card__icon overview-card__icon--mastery">
                    <Icon name="shield" />
                </div>
                <div className="overview-card__copy">
                    <span className="overview-card__label">Mastered cards</span>
                    <strong><AnimatedNumber value={stats.mastered} /></strong>
                    <span className="overview-card__meta">{masteryPercent}% of your library</span>
                </div>
                <div className="overview-progress" aria-hidden="true">
                    <span style={{ "--progress": `${masteryPercent}%` } as StyleWithVariables} />
                </div>
            </article>

            <article className="overview-card">
                <div className="overview-card__icon overview-card__icon--confidence">
                    <Icon name="cards" />
                </div>
                <div className="overview-card__copy">
                    <span className="overview-card__label">Cards in library</span>
                    <strong><AnimatedNumber value={stats.totalQuestions} /></strong>
                    <span className="overview-card__meta">
                        {stats.untouched} new · {stats.learning} learning
                    </span>
                </div>
                <span className="overview-card__signal" aria-hidden="true" />
            </article>
        </section>
    );
}
