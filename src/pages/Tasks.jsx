import React from "react";
import { Link } from "react-router-dom";

const Tasks = ({ tasks, selectListId, isDoneDisplay }) => {
  if (!tasks || tasks.length === 0) return <p>タスクがありません</p>;

  //残り時間の計算
  const getRemainingTime = (limit) => {
    if (!limit) return "期限なし";
    const limitDate = new Date(limit);
    const now = new Date();
    const diffMs = limitDate - now;
    if (diffMs < 0) return "期限切れ";
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${days}日 ${hours}時間 ${minutes}分`;
  };

  //以前は if 文で制御していたが、普通にフィルターで処理したほうがいい
  const filteredTasks = tasks.filter((task) => (isDoneDisplay === "done" ? task.done : !task.done));

  return (
    <ul>
      {filteredTasks.map((task) => (
        <li key={task.id} className="task-item">
          <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
            <strong>{task.title}</strong>
            <p>{task.done ? "完了" : "未完了"}</p>
            <p>期限: {task.limit ? new Date(task.limit).toLocaleString() : "なし"}</p>
            <p>残り時間: {getRemainingTime(task.limit)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Tasks;