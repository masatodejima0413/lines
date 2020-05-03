import React from 'react';
import fire from '../config/fire';

const App = () => {
  const handleLogout = () => {
    fire.auth().signOut();
  };
  return (
    <div>
      YOu are logged In
      <div onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default App;
