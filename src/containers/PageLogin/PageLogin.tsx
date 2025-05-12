import React, { FC, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Input from "shared/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { authService } from "utils/authService";
import toast from "react-hot-toast";

export interface PageLoginProps {
  className?: string;
}

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
      await authService.login(formData);
      const userData = await authService.getUserData();
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Login | YemekJet</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
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
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link to="/forgot-pass" className="text-sm text-green-600">
                  Forgot password?
                </Link>
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
              {loading ? "Logging in..." : "Continue"}
            </ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user?{" "}
            <Link className="text-green-600" to="/signup">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
