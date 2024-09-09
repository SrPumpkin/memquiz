import React, {useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../storage/hooks";
import {removeQuestion, updateQuestion} from "../storage/slice/questionsSlice";

import "./css/question.css"
import {setCaretPos} from "../utils/setCaretPos";

interface Props {
    question: string,
    answer: string,
    index: number
}
export default function Question({question, answer, index}: Props) {
    const [editorState, setEditorState] = useState(false)

    const data = useAppSelector(state => state.questions[index])
    const dispatch = useAppDispatch()

    const editorRef = useRef<HTMLParagraphElement>(null)

    useLayoutEffect(() => {
        // @ts-ignore
        const editor: HTMLParagraphElement = editorRef.current;
        setCaretPos(editor)
    }, [data.a]);

    const handleEdit = () => {
        setEditorState(!editorState)
    }

    const handleRemove = () => {
        dispatch(removeQuestion(index))
    }

    const handleEditor = (data: React.ChangeEvent<HTMLParagraphElement>) => {
        dispatch(updateQuestion({
            index: index,
            q: question,
            a: data.target.innerText
        }))
    }

    return(
        <div className="question-block">
            <div className="question">
                <h3>{data.q}</h3>
                <ul className="nav">
                    <li className="pen" onClick={handleEdit}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                    </li>
                    <li className="trash" onClick={handleRemove}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>
                    </li>
                </ul>
                <div className="num">{index + 1}</div>
            </div>
            <div className={`answer ${editorState ? "active" : ""}`}>
                <p ref={editorRef} contentEditable={true} onInput={handleEditor} suppressContentEditableWarning={true}>{data.a}</p>
            </div>
        </div>
    )
}