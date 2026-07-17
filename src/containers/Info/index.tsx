import "./style.css";

import { useAppDispatch, useAppSelector } from "../../storage/hooks";
import { closeData } from "../../storage/slice/quizSlice.tsx";
import Icon from "../../components/Icon";

export default function Info() {
    const quiz = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    return (
        <div aria-hidden={!quiz.info} className={`data-overlay info-overlay ${quiz.info ? "active" : ""}`}>
            <section
                aria-labelledby="about-title"
                aria-modal="true"
                className="data-window info-window"
                role="dialog"
            >
                <header className="data-window__header">
                    <div>
                        <span className="eyebrow">Product guide</span>
                        <h2 id="about-title">About MemQuiz</h2>
                    </div>
                    <button
                        aria-label="Close information"
                        className="icon-button"
                        onClick={() => dispatch(closeData())}
                        type="button"
                    >
                        <Icon name="x" />
                    </button>
                </header>

                <div className="info-window__body">
                    <div className="info-intro">
                        <div>
                            <h3>Build recall through short, focused sessions.</h3>
                            <p>
                                MemQuiz turns your own question-and-answer cards into adaptive reviews and keeps a learning history for every card.
                            </p>
                        </div>
                    </div>

                    <div className="info-flow" aria-label="How MemQuiz works">
                        <article>
                            <span>01</span>
                            <Icon name="plus" />
                            <h4>Create</h4>
                            <p>Add a clear prompt and a concise answer to your local library.</p>
                        </article>
                        <article>
                            <span>02</span>
                            <Icon name="play" />
                            <h4>Recall</h4>
                            <p>Start a session. Weaker cards are prioritized before the order is shuffled.</p>
                        </article>
                        <article>
                            <span>03</span>
                            <Icon name="chart" />
                            <h4>Improve</h4>
                            <p>Use mastery, confidence and attempt history to see what needs another review.</p>
                        </article>
                    </div>

                    <div className="info-intro">
                        <div>
                            <h3>The Science Behind Memorization</h3>
                            <p>
                                Explore the research-backed methods MemQuiz uses to strengthen recall, reinforce difficult material, and improve long-term retention.
                            </p>
                        </div>
                    </div>

                    <div className="info-flow" aria-label="How MemQuiz works">
                        <article>
                            <span>01</span>
                            <Icon name="flask" />
                            <h4>Active Recall</h4>
                            <p>Before revealing the answer, MemQuiz asks users to retrieve the information from memory on their own. This process strengthens the ability to recall information and supports longer-lasting retention more effectively than simply rereading the material.</p>
                            <a href="https://www.science.org/doi/10.1126/science.1152408">Research</a>
                        </article>
                        <article>
                            <span>02</span>
                            <Icon name="flask" />
                            <h4>Repeated Retrieval</h4>
                            <p>When users cannot recall an answer or are not confident in it, the card is returned to the queue and shown again during the same session. Repeated attempts to retrieve information from memory help reinforce it and increase the likelihood of successful recall in the future.</p>
                            <a href="https://doi.org/10.1016/j.jml.2006.09.004">Research</a>
                        </article>
                        <article>
                            <span>03</span>
                            <Icon name="flask" />
                            <h4>Corrective Feedback</h4>
                            <p>After each recall attempt, the application reveals the correct answer. This allows users to immediately identify mistakes, correct inaccurate knowledge, and reinforce the correct information.</p>
                            <a href="https://doi.org/10.1037/1076-898X.13.4.273">Research</a>
                        </article>
                        <article>
                            <span>04</span>
                            <Icon name="flask" />
                            <h4>Adaptive Practice</h4>
                            <p>MemQuiz analyzes the user’s answer history and gives higher priority to cards that were more difficult to recall. This allows users to spend more time on challenging material while reviewing well-learned information less frequently.</p>
                            <a href="https://doi.org/10.1037/1076-898X.14.2.101">Research</a>
                        </article>
                        <article>
                            <span>05</span>
                            <Icon name="flask" />
                            <h4>Metacognitive Assessment</h4>
                            <p>After successfully recalling an answer, users evaluate how confident they are in their response. This helps distinguish solid knowledge from a lucky guess and identifies material that may require additional practice.</p>
                            <a href="https://doi.org/10.1037/0022-0663.95.1.66">Research</a>
                        </article>
                    </div>

                    <div className="info-storage">
                        <span><Icon name="database" /></span>
                        <div>
                            <strong>Local by design</strong>
                            <p>
                                Questions and statistics are stored in this browser. Clearing its site data removes the library and review history.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
