import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";
import { Role } from "../types";

interface HospitalAloneRouteProps {
  children: ReactNode;
}

const HospitalAloneRoute: React.FC<HospitalAloneRouteProps> = ({ children }) => {
  const { role, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (role?.toLowerCase() !== Role.HOSPITAL.toLowerCase()) {
    return <Navigate to="/" />;
  }
  return (
    <>
      {children}
    </>
  );
};

export default HospitalAloneRoute;
