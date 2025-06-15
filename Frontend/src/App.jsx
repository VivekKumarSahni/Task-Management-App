import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import './App.css'
import {store} from './app/store';
import Login from './auth/Components/Login';
import { Provider } from "react-redux";
import TaskDashboard from './task/task';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Login></Login>
    ),
  },
  {
    path: '/task',
    element: (
      <TaskDashboard></TaskDashboard>
    ),
  },
  // {
  //   path: '/admin',
  //   element: (
  //     <AdminHome></AdminHome>
  //   ),
  // }
]);
function App() {

  return (
    <>
     <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
      
    </>
  )
}

export default App
