import React from "react";
import { Link } from "react-router-dom";
import logoImg from "images/logo.png";

export interface LogoProps {
  img?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      to="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {img ? (
        <img
          className="block max-h-16 sm:max-h-20"
          src={img}
          alt="Logo"
        />
      ) : (
        "Logo Here"
      )}
    </Link>
  );
};

export default Logo;
