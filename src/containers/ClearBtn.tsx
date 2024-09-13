import React, {useState, PointerEvent} from "react";
import {useAppDispatch} from "../storage/hooks";
import {cleanQuestions} from "../storage/slice/questionsSlice";

import "./css/clear-btn.css"

interface Props {
    duration: number
}

export default function ClearBtn({duration}: Props) {
    const [cleanState, setCleanState] = useState(false)
    const [timeout, setTimeoutState] = useState<ReturnType<typeof setTimeout>>()

    const dispatch = useAppDispatch()

    const handleStartClean = () => {
        setCleanState(true)

        let timeout = setTimeout(() => {
            dispatch(cleanQuestions())
        }, duration)

        setTimeoutState(timeout)
    }
    const handleStopClean = () => {
        clearTimeout(timeout)
        setCleanState(false)
    }

    return(
        <div className="btn-block">
            <div className={`progress-circle ${cleanState ? "clean-on" : ""}`}>
                <svg className="lh-gauge" viewBox="0 0 120 120">
                    <circle className="lh-gauge-arc" r="56" cx="60" cy="60" strokeWidth="8"></circle>
                </svg>
            </div>
            <button
                className="clean"
                onPointerDown={handleStartClean}
                onPointerUp={handleStopClean}
                onPointerLeave={handleStopClean}
            >Clean all</button>
        </div>
    )
}