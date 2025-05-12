import React, { FC, useState } from "react";
import { Helmet } from "react-helmet-async";
import Input from "shared/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { authService } from "utils/authService";
import toast from "react-hot-toast";

export interface PageSignUpProps {
  className?: string;
}

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageSignUp ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || YemekJet</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Sign up
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                First Name
              </span>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Last Name
              </span>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Username
              </span>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Continue"}
            </ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account?{" "}
            <Link className="text-green-600" to="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
