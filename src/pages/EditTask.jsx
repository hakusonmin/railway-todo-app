import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { url } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import './editTask.scss'

export const EditTask = () => {
    const navigate = useNavigate()
    const { listId, taskId } = useParams()
    const [cookies] = useCookies()
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')
    const [limit, setLimit] = useState('')
    const [isDone, setIsDone] = useState()
    const [errorMessage, setErrorMessage] = useState('')

    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleDetailChange = (e) => setDetail(e.target.value)
    const handleLimitChange = (e) => setLimit(e.target.value)
    const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')

    const onUpdateTask = () => {
        console.log(isDone)
        const data = {
            title: title,
            detail: detail,
            done: isDone,
            limit: new Date(limit).toISOString(),
        }

        axios
            .put(`/lists/${listId}/tasks/${taskId}`, data, {
                headers: {
                    authorization: `Bearer ${cookies.token}`,
                },
            })
            .then((res) => {
                console.log(res.data)
                navigate('/')
            })
            .catch((err) => {
                setErrorMessage(`更新に失敗しました。${err}`)
            })
    }

    const onDeleteTask = () => {
        axios
            .delete(`/lists/${listId}/tasks/${taskId}`, {
                headers: {
                    authorization: `Bearer ${cookies.token}`,
                },
            })
            .then(() => {
                navigate('/')
            })
            .catch((err) => {
                setErrorMessage(`削除に失敗しました。${err}`)
            })
    }

    useEffect(() => {
        axios
            .get(`/lists/${listId}/tasks/${taskId}`, {
                headers: {
                    authorization: `Bearer ${cookies.token}`,
                },
            })
            .then((res) => {
                const task = res.data
                setTitle(task.title)
                setDetail(task.detail)
                setIsDone(task.done)
                setLimit(
                    task.limit
                        //↓ここ 16で最初の16文字だけを切り出す(=つまり秒を部分を排除する)
                        ? new Date(task.limit).toISOString().slice(0, 16)
                        : ''
                )
            })
            .catch((err) => {
                setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
            })
    }, [])

    return (
        <div>
            <main className="edit-task">
                <h2>タスク編集</h2>
                <p className="error-message">{errorMessage}</p>

                <form className="edit-task-form">
                    <label>タイトル</label>
                    <br />
                    <input
                        type="text"
                        onChange={handleTitleChange}
                        className="edit-task-title"
                        value={title}
                    />
                    <br />

                    <label>詳細</label>
                    <br />
                    <textarea
                        type="text"
                        onChange={handleDetailChange}
                        className="edit-task-detail"
                        value={detail}
                    />
                    <br />

                    <label>期限日時</label>
                    <br />
                    <input
                        type="datetime-local"
                        onChange={handleLimitChange}
                        value={limit}
                    />
                    <br />

                    <div>
                        <input
                            type="radio"
                            id="todo"
                            name="status"
                            value="todo"
                            onChange={handleIsDoneChange}
                            checked={isDone === false ? 'checked' : ''}
                        />
                        未完了
                        <input
                            type="radio"
                            id="done"
                            name="status"
                            value="done"
                            onChange={handleIsDoneChange}
                            checked={isDone === true ? 'checked' : ''}
                        />
                        完了
                    </div>
                    <button
                        type="button"
                        className="delete-task-button"
                        onClick={onDeleteTask}
                    >
                        削除
                    </button>
                    <button
                        type="button"
                        className="edit-task-button"
                        onClick={onUpdateTask}
                    >
                        更新
                    </button>
                </form>
            </main>
        </div>
    )
}
