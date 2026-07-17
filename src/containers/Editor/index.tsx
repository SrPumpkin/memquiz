import "./style.css";

import { useAppSelector } from "../../storage/hooks";
import Question from "../../components/Question";
import Icon from "../../components/Icon";
import ClearBtn from "../../components/ClearBtn";

export default function Editor() {
    const questions = useAppSelector((state) => state.questions);
    const quiz = useAppSelector((state) => state.quiz);
    const reviewedCards = questions.filter((question) => question.history.length > 0).length;

    return(
        <section className={`editor ${quiz.editor ? "active" : ""}`} aria-labelledby="library-title">
            <header className="editor__header">
                <div>
                    <div className="editor__header-title">
                        <span className="eyebrow">Knowledge base</span>
                        <h1 id="library-title">Question library</h1>
                    </div>
                    <p>Review, refine and track every memory card in one place.</p>
                </div>
                <div className="editor__summary" aria-label="Library summary">
                    <ClearBtn duration={2500} />
                    <div className="editor__summary-data">
                        <span><b>{questions.length}</b> total cards</span>
                        <i />
                        <span><b>{reviewedCards}</b> reviewed</span>
                    </div>
                </div>
            </header>

            {questions.length > 0 ? (
                <ol className="editor__list">
                    {questions.map((question, index) => (
                        <li className="quiz-li" key={`${question.q}-${index}`}>
                            <Question
                                answer={question.a}
                                index={index}
                                question={question.q}
                            />
                        </li>
                    ))}
                </ol>
            ) : (
                <div className="editor-empty">
                    <div className="editor-empty__visual" aria-hidden="true">
                        <span><Icon name="cards" size={30} /></span>
                        <i />
                        <i />
                    </div>
                    <span className="eyebrow">Library empty</span>
                    <h2>Your first card starts here</h2>
                    <p>Add a question and answer in the composer. It will appear here with its learning history.</p>
                </div>
            )}
        </section>
    );
}
