import React from "react";

interface Props {
  onClick: () => void;
}

const Button: React.FC<Props> = ({ 
    onClick
  }) => { 
  return (
    <button type="submit"
      onClick={onClick}>Login
    </button>
    
  );
}

export default Button;
