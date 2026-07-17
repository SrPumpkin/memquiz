import "./style.css";

import { useAppSelector } from "../../storage/hooks";

import QuestionForm from "../QuestionForm";
import LearningOverview from "../LearningOverview";
import Editor from "../Editor";
import Quiz from "../Quiz";
import Statistics from "../Statistics";
import Info from "../Info";
import Settings from "../Settings";
import UI from "../UI";

export default function Content() {
    const quiz = useAppSelector((state) => state.quiz);

    return(
        <main className={`workspace ${quiz.quiz ? "workspace--session" : ""}`}>
            <div className="workspace__ambient" aria-hidden="true" />
            <div className="workspace__content">
                <QuestionForm />
                <div className="library-workspace">
                    <LearningOverview />
                    <Editor />
                </div>
            </div>

            <Quiz />
            <Statistics />
            <Info />
            <Settings />
            <UI />
        </main>
    );
}
