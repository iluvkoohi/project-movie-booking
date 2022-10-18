import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { baseUrl } from './const/api';
import { RecoilRoot } from 'recoil';
import axios from 'axios';
import NotFound from './pages/notfound';


const CinemaLogin = React.lazy(() => import('./pages/cinema/auth/cinema.auth.login'));
const CinemaFeed = React.lazy(() => import('./pages/cinema/feed.cinema'));
const CinemaManagment = React.lazy(() => import('./pages/cinema/management.cinema'));
const CinemaMovies = React.lazy(() => import('./pages/cinema/movie.cinema'));
const CinemaBillingsAndPayments = React.lazy(() => import('./pages/cinema/business.cinema'));
const MoviePreview = React.lazy(() => import('./pages/cinema/movie.cinema.preview'));
const AdminLogin = React.lazy(() => import('./pages/admin/auth/admin.auth.login'));
const AdminFeed = React.lazy(() => import('./pages/admin/feed.admin'));
const AdminMonetizationAndEarnings = React.lazy(() => import('./pages/admin/buiness.admin'));
const AdminUserSessions = React.lazy(() => import('./pages/admin/sessions.admin'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <CinemaLogin />,
    errorElement: <NotFound />
  },
  {
    path: "/me/:id",
    element: <CinemaFeed />
  },
  {
    path: "/cinema-management",
    element: <CinemaManagment />
  },
  {
    path: "/movie-management",
    element: <CinemaMovies />
  },
  {
    path: "/billings-and-payments",
    element: <CinemaBillingsAndPayments />,
    loader: async () => {
      const local = JSON.parse(localStorage.getItem('movie-booking:user'));
      return await axios.get(`${baseUrl}/api/payment/cinema/${local.user._id}`);
    }
  },
  {
    path: "/preview/:id",
    element: <MoviePreview />
  },
  {
    path: "/admin",
    element: <AdminLogin />
  },
  {
    path: "/admin/feed",
    element: <AdminFeed />,
    loader: async () => {
      return await axios.get(`${baseUrl}/api/user/all/business-permits`);
    }
  },
  {
    path: "/monetization-and-earnings",
    element: <AdminMonetizationAndEarnings />,
    loader: async () => {
      return await axios.get(`${baseUrl}/api/payments`);
    }
  },
  {
    path: "/user-sessions",
    element: <AdminUserSessions />
  }
]);



const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <RecoilRoot>
      <ChakraProvider>
        <ColorModeScript />
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ChakraProvider>
    </RecoilRoot>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
