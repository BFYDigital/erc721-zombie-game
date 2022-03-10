import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import FooterBar from './FooterBar';

const MainLayout = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <FooterBar />
    </>
  );
};

export default MainLayout;
