import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './app/store';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import AuthComponent from './features/auth/AuthComponent';
import Story from './features/stories/Story.jsx';
import CreateStoryForm from './features/stories/CreateStoryForm.jsx';
import Contributors from './features/contributions/Contributors.jsx';
import ContributionForm from './features/contributions/ContributionForm.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <AuthComponent />,
      },
      {
        path: 'signup',
        element: <AuthComponent />,
      },
      {
        path: 'create-story',
        element: <CreateStoryForm />,
      },
      {
        path: 'story/:storyId',
        element: <Story />,
      },
      {
        path: 'story/:storyId/contribute',
        element: <ContributionForm />,
      },
      {
        path: 'story/:storyId/contributors',
        element: <Contributors />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <StrictMode> */}
    <RouterProvider router={router} />
    {/* </StrictMode> */}
  </Provider>,
)
