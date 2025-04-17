import { useState } from "react";
import axios from "axios";
import { Task } from "./Table.tsx";

interface Props {
  title?: string;
  button_text: string;
  onTaskAdded?: (newTask: Task) => void;
}

function AddTask({ title = "", button_text, onTaskAdded }: Props) {
  const [content, setContent] = useState("");
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://reactflasktaskmanagerbackend-production.up.railway.app/api/tasks",
        {
          content,
        }
      );

      console.log("New task added:", res.data); // response from Flask
      const newTask: Task = res.data;
      if (onTaskAdded) {
        onTaskAdded(newTask);
      }

      setContent("");
    } catch (err) {
      console.log("error add task:", err);
    }
  };
  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={handleClick}>
        <div className="form-floating m-2">
          <input 
            required
            className="form-control"
            type="text"
            name="content"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label className="label" htmlFor="content">
            Task:
          </label>
        </div>
        <input className="btn btn-success" type="submit" value={button_text} />
      </form>
    </div>
  );
}

export default AddTask;
