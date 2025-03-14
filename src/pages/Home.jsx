import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { url } from "../const";
import "./home.scss";
import Tasks from "./Tasks";


export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();

  useEffect(() => {
    axios.get(`/lists`, {
      headers: {
        authorization: `Bearer ${cookies.token}`
      }
    })
    .then((res) => {
      setLists(res.data);
      //デフォルトのリストを設定
      if (res.data.length > 0) {
        setSelectListId(res.data[0].id); 
      }
    })
    .catch((err) => {
      setErrorMessage(`リストの取得に失敗しました。${err}`);
    })
  }, []);

  useEffect(() => {
    if (!selectListId) return;

      axios.get(`/lists/${selectListId}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`
        }
      })
      .then((res) => {
        setTasks(res.data.tasks)
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  }, [selectListId]);

  const handleSelectList = (id) => {
    setSelectListId(id);
  }

  //これで対象のリストに移動してさらにEnterされていた場合handleSelectListを発火する
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelectList(id);
    }
  };

  return (
    <div>
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p><Link to="/list/new">リスト新規作成</Link></p>
              <p><Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link></p>
            </div>
          </div>

          <ul className="list-tab" role="tablist">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li 
                  key={key}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex="0" 
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={(e) => handleKeyDown(e, list.id)}
                >
                  {list.title}
                </li>
              )
            })}
          </ul>

          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>

            <div className="display-select-wrapper">
              <select onChange={(e) => setIsDoneDisplay(e.target.value)} className="display-select">
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>

            {/* タスク一覧を表示 */}
            <Tasks tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />
          </div>
        </div>
      </main>
    </div>
  )
}

