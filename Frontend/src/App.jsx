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
import SignUp from './auth/Components/SignUp';
import { Provider } from "react-redux";
import TaskDashboard from './task/task';
import TaskAssignment from './task/assigntask';
import AuditLogTable from './auditlog/log';
import SidebarLayout from './Components/SidebarLayout';


const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Login></Login>
    ),
  },
  {
    path: '/signup',
    element: (
      <SignUp></SignUp>  
  ),
  },
  {
    path: '/task',
    element: (
      <SidebarLayout>
        <TaskDashboard />
      </SidebarLayout>
    ),
  },
  {
    path: '/assign-task',
    element: (
       <SidebarLayout>
        <TaskAssignment />
      </SidebarLayout>
    ),
  },
  {
    path: '/logs',
    element: (
      <SidebarLayout>
        <AuditLogTable />
      </SidebarLayout>
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
