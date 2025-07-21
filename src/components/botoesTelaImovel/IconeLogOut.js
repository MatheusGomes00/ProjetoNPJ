import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import useAuth from "../Seguranca/UseAuth"; 

function IconeLogOut() {

  const { userLogout } = useAuth();
  const handleLogout = () => {
    userLogout();
  };

  return (
    <div className="icon-wrapper">
      <FaSignOutAlt className="icon" onClick={handleLogout} />
    </div>
  );
}

export default IconeLogOut;
