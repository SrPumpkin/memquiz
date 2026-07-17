import type { QuestionProps } from "../storage/slice/questionsSlice";

export interface ActivityPoint {
    dateKey: string;
    label: string;
    attempts: number;
    correct: number;
}

export interface LearningStatistics {
    totalQuestions: number;
    totalAttempts: number;
    correctAttempts: number;
    wrongAttempts: number;
    accuracy: number;
    averageConfidence: number;
    mastered: number;
    learning: number;
    untouched: number;
    activeDayStreak: number;
    activity: ActivityPoint[];
}

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const getQuestionMastery = (question: QuestionProps) => {
    const attempts = question.correctCount + question.wrongCount;
    return attempts === 0 ? 0 : Math.round((question.correctCount / attempts) * 100);
};

export const calculateLearningStatistics = (questions: QuestionProps[]): LearningStatistics => {
    const attempts = questions.flatMap((question) => question.history);
    const correctAttempts = attempts.filter((attempt) => attempt.correct).length;
    const wrongAttempts = attempts.length - correctAttempts;
    const accuracy = attempts.length === 0
        ? 0
        : Math.round((correctAttempts / attempts.length) * 100);
    const averageConfidence = attempts.length === 0
        ? 0
        : attempts.reduce((sum, attempt) => sum + attempt.confidence, 0) / attempts.length;

    let mastered = 0;
    let learning = 0;
    let untouched = 0;

    questions.forEach((question) => {
        const total = question.correctCount + question.wrongCount;
        const mastery = getQuestionMastery(question);

        if (total === 0) {
            untouched += 1;
        } else if (mastery >= 70) {
            mastered += 1;
        } else {
            learning += 1;
        }
    });

    const activity: ActivityPoint[] = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));

        return {
            dateKey: toDateKey(date),
            label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
            attempts: 0,
            correct: 0,
        };
    });

    const activityByDate = new Map(activity.map((point) => [point.dateKey, point]));
    const uniqueActiveDates = new Set<string>();

    attempts.forEach((attempt) => {
        const attemptDate = new Date(attempt.date);
        const key = toDateKey(attemptDate);
        uniqueActiveDates.add(key);
        const point = activityByDate.get(key);

        if (point) {
            point.attempts += 1;
            if (attempt.correct) point.correct += 1;
        }
    });

    let activeDayStreak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (uniqueActiveDates.has(toDateKey(cursor))) {
        activeDayStreak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return {
        totalQuestions: questions.length,
        totalAttempts: attempts.length,
        correctAttempts,
        wrongAttempts,
        accuracy,
        averageConfidence,
        mastered,
        learning,
        untouched,
        activeDayStreak,
        activity,
    };
};
