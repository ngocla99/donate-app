import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className='min-h-screen bg-amber-50/30'>
      <Header />
      <div className='pt-[65px]'>{children || <Outlet />}</div>
    </div>
  );
};

export default AppLayout;
