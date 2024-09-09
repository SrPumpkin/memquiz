import {useAppSelector} from "../storage/hooks";
import QuizQuestion from "../components/QuizQuestion";

import "./css/quiz.css"

export default function Quiz() {
    const quiz = useAppSelector(state => state.quiz)

    return(
        <div className={`quiz ${quiz.quiz ? "active" : ""}`}>
            <span className="question-num">{quiz.curQuestion + 1}/{quiz.questions.length}</span>
            {quiz.questions.map((q, i) => {
                return <QuizQuestion
                    key={i}
                    q={q.q}
                    a={q.a}
                    index={i}
                    length={quiz.questions.length}
                    current={quiz.curQuestion}
                />
            })}
        </div>
    )
}