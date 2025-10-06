import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/login.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    position: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-text-box">
          <h1>Join Our HRIS Platform</h1>
          <p>
            Dapatkan akses ke seluruh fitur pengelolaan karyawan dan sistem HR
            modern yang memudahkan pekerjaan Anda setiap hari.
          </p>
        </div>
        <footer>© 2025 HRIS System — All rights reserved</footer>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-form-box">
          <h2 className="text-center mb-4">Create Account</h2>

          {error && (
            <div className="alert alert-danger text-center py-2 mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Enter your phone number"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Position */}
            <div className="mb-3">
              <label className="form-label">Position</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-briefcase"></i>
                </span>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  placeholder="Enter your position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-shield-lock"></i>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-login w-100 py-2"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-4 small">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
