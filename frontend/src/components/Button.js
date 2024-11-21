import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button
      className="button-bounce transition-all duration-300 ease-in-out hover:scale-105"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;