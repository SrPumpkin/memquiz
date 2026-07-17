import "./style.css";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { clearQuestionQuiz, setCurQuestion, toggleQuiz } from "../../storage/slice/quizSlice.tsx";

import Icon from "../../components/Icon";

export default function UI() {
    const quiz = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    const handleStopQuiz = () => {
        dispatch(clearQuestionQuiz());
        dispatch(toggleQuiz());
        dispatch(setCurQuestion(0));
    };

    return (
        <div className={`session-controls ${quiz.quiz ? "active" : ""}`}>
            <div className="session-controls__status">
                <span><i />Session in progress</span>
                <small>Your completed reviews are saved automatically.</small>
            </div>
            <button className="secondary-button secondary-button--danger" onClick={handleStopQuiz} type="button">
                <Icon name="stop" size={16} />
                Stop session
            </button>
        </div>
    );
}
