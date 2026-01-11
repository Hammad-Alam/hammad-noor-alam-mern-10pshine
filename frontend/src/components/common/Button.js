import React from "react";

function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className="bg-indigo-600 w-full px-3 md:px-4 py-2 rounded-md shadow text-white mx-auto hover:bg-indigo-700 
        transition duration-300 ease-in-out"
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}

export default Button;
