import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store.js";
import { Role } from "../types/index.js";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const {  role, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (role.toLowerCase() !== Role.PATIENT.toLowerCase()) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
