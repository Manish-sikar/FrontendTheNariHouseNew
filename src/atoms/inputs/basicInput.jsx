import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  required = false,
  ...props
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        className="form-control"
        required={required}
        {...props}
      />
    </div>
  );
};

export default Input;
