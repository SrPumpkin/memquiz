import {useAppSelector} from "../storage/hooks";

import "./css/info.css"

export default function Info()  {
    const quiz = useAppSelector(state => state.quiz)

    return(
        <div className={`info ${quiz.info ? "active" : ""}`}>
            <div className="decor">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
            </div>
            <h3>About</h3>
            <p>
                This app is designed to help you create and take simple question/answer tests. All data is stored in your device's memory, so clearing your browser cache will result in data loss.
            </p>
            <p>
                All you need to do is add a question in the <b>Q</b> field, an answer in the <b>A</b> field and click the add button - this way you <b>Add</b> your question to the quiz. On the right you can delete or edit your questions. Clicking the <b>Start</b> button will launch the test.
            </p>
        </div>
    )
}