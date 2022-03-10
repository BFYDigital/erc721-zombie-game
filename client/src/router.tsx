import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router';
import SuspenseLoader from './components/SuspenseLoader';
import MainLayout from './layouts/MainLayout';

const Loader = (Component: any) => (props: any) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

const Home = Loader(lazy(() => import('./pages/home/Home')));
const Fight = Loader(lazy(() => import('./pages/fight/Fight')));

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'fight/:zombieId',
        element: <Fight />
      },
    ]
  }
];

export default routes;
