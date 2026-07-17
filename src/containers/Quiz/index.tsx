import "./style.css";

import { useEffect, useState, type CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "../../storage/hooks";

import Icon from "../../components/Icon";
import QuizQuestion from "../../components/QuizQuestion";
import AnimatedNumber from "../../components/AnimatedNumber";

import {QuestionProps} from "../../storage/slice/questionsSlice.tsx";
import {
    addQuestionQuiz,
    clearQuestionQuiz,
    requeueQuestion,
    setCurQuestion,
    toggleQuiz,
} from "../../storage/slice/quizSlice.tsx";


interface SessionAttempt {
    correct: boolean;
    confidence: number;
}

interface SessionStats {
    total: number;
    correct: number;
    avgConfidence: number;
}

type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number>;

export default function Quiz() {
    const quiz = useAppSelector((state) => state.quiz);
    const questions = useAppSelector((state) => state.questions);
    const dispatch = useAppDispatch();
    const [showResults, setShowResults] = useState(false);
    const [sessionAttempts, setSessionAttempts] = useState<SessionAttempt[]>([]);
    const [sessionSeed, setSessionSeed] = useState<QuestionProps[]>([]);
    const [sessionStats, setSessionStats] = useState<SessionStats>({
        total: 0,
        correct: 0,
        avgConfidence: 0,
    });

    useEffect(() => {
        if (quiz.quiz) {
            setSessionAttempts([]);
            setSessionSeed(quiz.questions);
        }
    }, [quiz.quiz]);

    const handleAttempt = (correct: boolean, confidence: number) => {
        setSessionAttempts((attempts) => [...attempts, { correct, confidence }]);
    };

    const handleRequeue = (question: { q: string; a: string }) => {
        const sourceQuestion = questions.find((candidate) => (
            candidate.q === question.q && candidate.a === question.a
        ));

        if (sourceQuestion) {
            dispatch(requeueQuestion(sourceQuestion));
        }
    };

    const handleNext = () => {
        const nextIndex = quiz.curQuestion + 1;

        if (nextIndex < quiz.questions.length) {
            dispatch(setCurQuestion(nextIndex));
            return;
        }

        const total = sessionAttempts.length;
        const correct = sessionAttempts.filter((attempt) => attempt.correct).length;
        const totalConfidence = sessionAttempts.reduce(
            (sum, attempt) => sum + attempt.confidence,
            0
        );

        setSessionStats({
            total,
            correct,
            avgConfidence: total === 0 ? 0 : totalConfidence / total,
        });
        setShowResults(true);
        dispatch(clearQuestionQuiz());
        dispatch(toggleQuiz());
        dispatch(setCurQuestion(0));
    };

    const handleRestart = () => {
        if (sessionSeed.length === 0) {
            setShowResults(false);
            return;
        }

        setShowResults(false);
        setSessionAttempts([]);
        dispatch(toggleQuiz());
        sessionSeed.forEach((question) => dispatch(addQuestionQuiz(question)));
        dispatch(setCurQuestion(0));
    };

    const progress = quiz.questions.length === 0
        ? 0
        : ((quiz.curQuestion + 1) / quiz.questions.length) * 100;
    const score = sessionStats.total === 0
        ? 0
        : Math.round((sessionStats.correct / sessionStats.total) * 100);

    return (
        <>
            <section className={`quiz ${quiz.quiz ? "active" : ""}`} aria-label="Recall session">
                <div className="quiz__chrome">
                    <div className="quiz__progress-copy">
                        <span>Adaptive recall session</span>
                        <strong>Card {quiz.curQuestion + 1} of {quiz.questions.length}</strong>
                    </div>
                    <div className="quiz__progress-track" aria-hidden="true">
                        <span style={{ "--session-progress": `${progress}%` } as StyleWithVariables} />
                    </div>
                    <div className="quiz__mode">
                        <i /> Focus mode
                    </div>
                </div>

                <div className="quiz__questions">
                    {quiz.questions.map((question, position) => {
                        const referenceIndex = questions.indexOf(question);
                        const sourceIndex = referenceIndex >= 0
                            ? referenceIndex
                            : questions.findIndex((candidate) => (
                                candidate.q === question.q && candidate.a === question.a
                            ));

                        return (
                            <QuizQuestion
                                a={question.a}
                                key={`${question.q}-${question.a}-${position}`}
                                length={quiz.questions.length}
                                onAttempt={handleAttempt}
                                onNext={handleNext}
                                onRequeue={handleRequeue}
                                position={position}
                                q={question.q}
                                questionIndex={quiz.curQuestion}
                                sourceIndex={sourceIndex}
                            />
                        );
                    })}
                </div>
            </section>

            <div className={`results-modal ${showResults ? "active" : ""}`} aria-hidden={!showResults}>
                <section className="results-content" aria-labelledby="results-title" aria-modal="true" role="dialog">
                    <div className="results-content__celebration" aria-hidden="true">
                        <i /><i /><i /><i /><i />
                    </div>
                    <span className="results-content__icon"><Icon name="shield" size={26} /></span>
                    <span className="eyebrow">Session complete</span>
                    <h2 id="results-title">Recall report</h2>
                    <p>Your review history has been saved to the library.</p>

                    <div className="results-score">
                        <svg viewBox="0 0 132 132" aria-hidden="true">
                            <circle cx="66" cy="66" r="52" pathLength="100" />
                            <circle cx="66" cy="66" r="52" pathLength="100" strokeDasharray={`${score} 100`} />
                        </svg>
                        <div>
                            <strong><AnimatedNumber value={score} suffix="%" /></strong>
                            <span>recall score</span>
                        </div>
                    </div>

                    <div className="results-stats">
                        <article>
                            <span><Icon name="check" /></span>
                            <div>
                                <strong>{sessionStats.correct} / {sessionStats.total}</strong>
                                <small>Successful recalls</small>
                            </div>
                        </article>
                        <article>
                            <span><Icon name="target" /></span>
                            <div>
                                <strong><AnimatedNumber value={sessionStats.avgConfidence} decimals={1} suffix=" / 5" /></strong>
                                <small>Average confidence</small>
                            </div>
                        </article>
                    </div>

                    <div className="results-actions">
                        <button className="primary-button" onClick={handleRestart} type="button">
                            <Icon name="rotate" />
                            Restart this set
                        </button>
                        <button className="secondary-button" onClick={() => setShowResults(false)} type="button">
                            Back to library
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}
