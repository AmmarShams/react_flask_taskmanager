import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "./AddTask";

export interface Task {
  id: number;
  content: string;
  dateCreated: string;
}

function Table() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingContent(task.content);
  };

  const handleUpdate = async (id: number) => {
    try {
      axios.post(
        `https://reactflasktaskmanagerbackend-production.up.railway.app/api/tasks/edit/${id}`,
        {
          content: editingContent,
        }
      );
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, content: editingContent } : task
        )
      );
      setEditingId(null);
    } catch (err) {
      console.log("There was an error editing this task", err);
    }
  };
  const handleDelete = async (taskId: number) => {
    try {
      await axios.delete(
        `https://reactflasktaskmanagerbackend-production.up.railway.app/api/tasks/${taskId}`
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("There was a problem deleting this", err);
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://reactflasktaskmanagerbackend-production.up.railway.app/api/tasks"
      )
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>

      <div className="row">
        <div className="col-md-8 text-center">
          <table className="table">
            <tbody>
              <tr>
                <th className="col">Task</th>
                <th className="col">Action</th>
              </tr>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    {editingId === task.id ? (
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                    ) : (
                      task.content
                    )}
                  </td>
                  <td>
                    {editingId === task.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(task.id)}
                          className="btn btn-success btn-sm m-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary btn-sm m-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <a
                          className="btn btn-outline-primary mb-1"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </a>
                        <br />
                        <a
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </a>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4 mt-5">
          <AddTask button_text="Add Task" onTaskAdded={handleTaskAdded} />
        </div>
      </div>
    </div>
  );
}

export default Table;
