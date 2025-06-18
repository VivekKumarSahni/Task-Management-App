import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasksByFiltersAsync,
  createTaskAsync,
  updateTaskAsync,
  selectAllTasks,
} from "./taskSlice";
import { deleteTaskAsync } from './taskSlice'; 

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  // const tasks = taskData.tsks;

  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("due_date");

  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "", priority: "", due_date: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTasksByFiltersAsync({ filter: filters, sortBy, order: sortOrder }));
  }, [filters, sortOrder, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    editingTask
      ? setEditingTask({ ...editingTask, [name]: value })
      : setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = () => {
    if (editingTask) {
      dispatch(updateTaskAsync(editingTask));
      setEditingTask(null);
    } else {
      dispatch(createTaskAsync(newTask));
    }
    setNewTask({ title: "", description: "", status: "", priority: "", due_date: "" });
  };

  const confirmDelete = (id) => {
    setShowDeleteModal(id);
  };

 const deleteTask = () => {
  dispatch(deleteTaskAsync(showDeleteModal));
  setShowDeleteModal(null);
};

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  // console.log(taskData);
  console.log(tasks);
  const currentTasks = tasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Task Dashboard</h2>

      {/* Filter and Sort */}
      <div className="flex gap-4 mb-6">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          onClick={handleSort}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sort by Due Date ({sortOrder})
        </button>
      </div>

      {/* Add/Edit Form */}
      <div className="border p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{editingTask ? "Edit Task" : "Add New Task"}</h3>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          name="title"
          value={editingTask ? editingTask.title : newTask.title}
          onChange={handleInputChange}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Description"
          name="description"
          value={editingTask ? editingTask.description : newTask.description}
          onChange={handleInputChange}
        />
        <div className="flex gap-2 mb-2">
          <select
            className="border p-2 flex-1"
            name="status"
            value={editingTask ? editingTask.status : newTask.status}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="border p-2 flex-1"
            name="priority"
            value={editingTask ? editingTask.priority : newTask.priority}
            onChange={handleInputChange}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            className="border p-2 flex-1"
            name="due_date"
            type="date"
            value={editingTask ? editingTask.due_date : newTask.due_date}
            onChange={handleInputChange}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task Table */}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Priority</th>
            <th className="border px-2 py-1">Due Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-2 py-1">{task.title}</td>
              <td className="border px-2 py-1">{task.description}</td>
              <td className="border px-2 py-1">{task.status}</td>
              <td className="border px-2 py-1">{task.priority}</td>
              <td className="border px-2 py-1">{task.due_date}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => setEditingTask(task)}
                  className="text-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(task.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mb-10">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex gap-4">
              <button
                onClick={deleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
