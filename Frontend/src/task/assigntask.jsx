import { useEffect, useState } from "react";
import axios from "axios";

const TaskAssignment = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:8000/task").then((res) => {
      setTasks(res.data.tasks); // Adjust if your API response is different
      groupTasksByUser(res.data.tasks);
    });
  }, []);

  const groupTasksByUser = (tasks) => {
    const grouped = tasks.reduce((acc, task) => {
      const userId = task.user_id || "Unassigned";
      acc[userId] = acc[userId] || [];
      acc[userId].push(task);
      return acc;
    }, {});
    setGroupedTasks(grouped);
  };

  const handleAssign = (taskId, userId) => {
    axios
      .patch(`http://localhost:8000/task/${taskId}`, { user_id: userId })
      .then(() => {
        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, user_id: userId } : t
        );
        setTasks(updatedTasks);
        groupTasksByUser(updatedTasks);
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        📝 Task Assignment Panel
      </h2>
      {Object.entries(groupedTasks).map(([userId, userTasks]) => {
        const user = users.find((u) => u.id.toString() === userId);
        return (
          <div
            key={userId}
            className="bg-white rounded-lg shadow-md p-6 mb-10 border border-gray-200"
          >
            <div className="mb-4 border-b pb-2">
              <h3 className="text-xl font-semibold text-indigo-700">
                {user ? user.name : "Unassigned"}
              </h3>
              {user && (
                <p className="text-sm text-gray-500 italic">{user.email}</p>
              )}
            </div>
            <ul className="space-y-4">
              {userTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 bg-indigo-50 rounded-md border-l-4 border-indigo-400 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-indigo-900">
                      {task.title}
                    </h4>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        task.priority === "High"
                          ? "bg-red-200 text-red-800"
                          : task.priority === "Medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {task.status} &nbsp; | &nbsp;
                    <strong>Due:</strong>{" "}
                    {new Date(task.due_date).toLocaleDateString()}
                  </p>
                  <div className="mt-3">
                   <label className="block text-sm text-gray-600 mb-1">
  {task.user_id ? "Reassign Task:" : "Assign Task:"}
</label>

                    <select
                      value={task.user_id || ""}
                      onChange={(e) =>
                        handleAssign(task.id, parseInt(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default TaskAssignment;
