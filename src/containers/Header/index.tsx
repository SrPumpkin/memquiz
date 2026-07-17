import "./style.css";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { toggleState } from "../../storage/slice/quizSlice.tsx";
import Icon from "../../components/Icon";

export default function Header() {
    const dispatch = useAppDispatch();
    const quiz = useAppSelector((state) => state.quiz);

    return(
        <header className="app-header">
            <div className="brand-block">
                <div className="brand-copy">
                    <strong>MemQuiz</strong>
                </div>
            </div>

            <nav className="header-nav" aria-label="Primary navigation">
                <button
                    className={quiz.results ? "active" : ""}
                    disabled={quiz.quiz}
                    onClick={() => dispatch(toggleState("results"))}
                    type="button"
                >
                    <Icon name="chart" />
                    <span>Statistics</span>
                </button>
                <button
                    className={quiz.settings ? "active" : ""}
                    disabled={quiz.quiz}
                    onClick={() => dispatch(toggleState("settings"))}
                    type="button"
                >
                    <Icon name="settings" />
                    <span>Settings</span>
                </button>
                <button
                    className={quiz.info ? "active" : ""}
                    disabled={quiz.quiz}
                    onClick={() => dispatch(toggleState("info"))}
                    type="button"
                >
                    <Icon name="info" />
                    <span>About</span>
                </button>
                <a
                    aria-label="Open the developer's GitHub profile"
                    className="header-nav__external"
                    href="https://github.com/SrPumpkin"
                    rel="noreferrer"
                    target="_blank"
                >
                    <Icon name="github" />
                </a>
            </nav>
        </header>
    );
}
