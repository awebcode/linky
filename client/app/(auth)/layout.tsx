import React from "react";
interface Props {
  children: React.ReactNode;
}
const AuthLayout: React.FC<Props> = ({ children }) => {
  return <> {children}</>;
};

export default AuthLayout;
