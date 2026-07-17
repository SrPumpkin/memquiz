import "./style.css";

import { useRef, useState, type CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { cleanQuestions } from "../../storage/slice/questionsSlice.tsx";
import { setAmountQuestion } from "../../storage/slice/settingsSlice.tsx";
import Icon from "../Icon";

type StyleWithVariables = CSSProperties & Record<`--${string}`, string | number>;

interface Props {
    duration: number
}

export default function ClearBtn({duration}: Props) {
    const [cleanState, setCleanState] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const questionCount = useAppSelector((state) => state.questions.length);
    const dispatch = useAppDispatch();

    const handleStartClean = () => {
        if (questionCount === 0 || timeoutRef.current) return;

        setCleanState(true);

        timeoutRef.current = setTimeout(() => {
            dispatch(cleanQuestions());
            dispatch(setAmountQuestion(0));
            setCleanState(false);
            timeoutRef.current = null;
        }, duration);
    };

    const handleStopClean = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setCleanState(false);
    };

    return(
        <div
            className={`clear-control ${cleanState ? "clear-control--active" : ""}`}
            style={{ "--hold-duration": `${duration}ms` } as StyleWithVariables}
        >
            <button
                aria-label="Hold to clear the entire question library"
                className="clear-control__button"
                disabled={questionCount === 0}
                onPointerCancel={handleStopClean}
                onPointerDown={handleStartClean}
                onPointerLeave={handleStopClean}
                onPointerUp={handleStopClean}
                type="button"
            >
                <span className="clear-control__progress" aria-hidden="true" />
                <Icon name="trash" size={17} />
                <span>
                    <b>{cleanState ? "Keep holding…" : "Clear library"}</b>
                    <small>{questionCount === 0 ? "No cards to remove" : "Hold for 2.5 seconds"}</small>
                </span>
            </button>
        </div>
    );
}
