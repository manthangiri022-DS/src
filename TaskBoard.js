

import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { ref, onValue, push, update, remove } from "firebase/database";
import "./App.css";

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Listen for realtime updates
  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedTasks = Object.entries(data)
        .map(([id, task]) => ({ id, ...task }))
        .filter(t => t.text && t.status); // ✅ filter invalid entries
      setTasks(loadedTasks);
    });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    push(ref(db, "tasks"), { text: newTask, status: "todo" });
    setNewTask("");
  };

  const moveTask = (task, direction) => {
    let newStatus = task.status;
    if (direction === "forward") {
      if (task.status === "todo") newStatus = "inprogress";
      else if (task.status === "inprogress") newStatus = "completed";
    } else if (direction === "back") {
      if (task.status === "completed") newStatus = "inprogress";
      else if (task.status === "inprogress") newStatus = "todo";
    }
    update(ref(db, "tasks/" + task.id), { status: newStatus });
  };

  const deleteTask = (task) => {
    remove(ref(db, "tasks/" + task.id));
  };

  const editTask = (task) => {
    const updatedText = prompt("Edit task:", task.text);
    if (updatedText && updatedText.trim()) {
      update(ref(db, "tasks/" + task.id), { text: updatedText });
    }
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  // ✅ Correct progress calculation
  const completedCount = getTasksByStatus("completed").length;
  const progressPercent =
    tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="app">
      <header>
        <h1>📌 My Task Board</h1>
      </header>

      {/* Progress bar with numeric label */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="progress-label">
          {completedCount} of {tasks.length} tasks completed
        </p>
      </div>

      {/* Add task */}
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Board */}
      <div className="board">
        {["todo", "inprogress", "completed"].map((status) => {
          const columnTasks = getTasksByStatus(status);
          const titles = {
            todo: "📋 To Do",
            inprogress: "⚙️ In Progress",
            completed: "✅ Completed",
          };
          return (
            <div className="column" key={status}>
              <h2>
                {titles[status]} ({columnTasks.length})
              </h2>
              {columnTasks.length === 0 ? (
                <p className="empty-message">No tasks yet — add one!</p>
              ) : (
                columnTasks.map((task) => (
                  <div className="task-card" key={task.id}>
                    <span>{task.text}</span>
                    <div className="buttons">
                      {task.status !== "todo" && (
                        <button onClick={() => moveTask(task, "back")}>◀</button>
                      )}
                      {task.status !== "completed" && (
                        <button onClick={() => moveTask(task, "forward")}>▶</button>
                      )}
                      <button onClick={() => editTask(task)}>✎</button>
                      <button onClick={() => deleteTask(task)}>✖</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <footer>
        <p className="footer-quote">
          🌟 Small progress each day adds up to big results.
        </p>
      </footer>
    </div>
  );
}

export default TaskBoard;



