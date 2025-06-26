import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasksByFiltersAsync,
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  selectAllTasks,
  selectTotalItems,
} from "./taskSlice";

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const totalItems = useSelector(selectTotalItems);

  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("due_date");
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "", priority: "", due_date: "" });
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTasksByFiltersAsync({ filter: filters, sortBy, order: sortOrder, page: currentPage }));
  }, [filters, sortOrder, sortBy, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    editingTask ? setEditingTask({ ...editingTask, [name]: value }) : setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = () => {
    if (editingTask) {
      dispatch(updateTaskAsync(editingTask));
      setEditingTask(null);
    } else {
      dispatch(createTaskAsync(newTask));
    }
    setNewTask({ title: "", description: "", status: "", priority: "", due_date: "" });
    setShowForm(false);
  };

  const confirmDelete = (id) => {
    setShowDeleteModal(id);
  };

  const deleteTask = () => {
    dispatch(deleteTaskAsync(showDeleteModal));
    setShowDeleteModal(null);
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-blue-100 text-blue-700";
      case "Medium": return "bg-orange-100 text-orange-700";
      case "High": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const currentTasks = tasks;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">📋 Task Dashboard</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-2 rounded shadow">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="border p-2 rounded shadow">
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={handleSort} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-purple-700">
          Sort by Due Date ({sortOrder})
        </button>

        <button onClick={() => { setEditingTask(null); setShowForm(true); }} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
          + Create Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white border p-6 rounded shadow mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingTask ? "Edit Task" : "Add New Task"}</h3>
          <input className="border p-2 w-full mb-3 rounded" placeholder="Title" name="title" value={editingTask ? editingTask.title : newTask.title} onChange={handleInputChange} />
          <textarea className="border p-2 w-full mb-3 rounded" placeholder="Description" name="description" value={editingTask ? editingTask.description : newTask.description} onChange={handleInputChange} />

          <div className="flex gap-3 mb-3">
            <select className="border p-2 flex-1 rounded" name="status" value={editingTask ? editingTask.status : newTask.status} onChange={handleInputChange}>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <select className="border p-2 flex-1 rounded" name="priority" value={editingTask ? editingTask.priority : newTask.priority} onChange={handleInputChange}>
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input className="border p-2 flex-1 rounded" name="due_date" type="date" value={editingTask ? editingTask.due_date : newTask.due_date} onChange={handleInputChange} />
          </div>

          <div className="flex gap-4">
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
              {editingTask ? "Update Task" : "Add Task"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 px-6 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 mb-10">
        {currentTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">Due: {task.due_date}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => { setEditingTask(task); setShowForm(true); }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => confirmDelete(task.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{task.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>Status: {task.status}</span>
              <span className={`px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>Priority: {task.priority}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded shadow ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}>
            {i + 1}
          </button>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl">
            <p className="mb-4 text-lg text-gray-700">Are you sure you want to delete this task?</p>
            <div className="flex gap-4">
              <button onClick={deleteTask} className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">Delete</button>
              <button onClick={() => setShowDeleteModal(null)} className="bg-gray-400 px-5 py-2 rounded hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;