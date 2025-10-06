import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/api";
import Layout from "../components/Layout";

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    position: "",
    profilePicture: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phone || "",
        position: data.position || "",
        profilePicture: data.photo || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile({
        name: profile.name,
        phone: profile.phoneNumber,
        position: profile.position,
      });
      updateUser(updatedUser);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("❌ New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await userService.updateProfile({ password: passwordForm.newPassword });
      alert("✅ Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("❌ Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    setLoading(true);
    try {
      const response = await userService.uploadProfilePicture(formData);
      setProfile((prev) => ({ ...prev, profilePicture: response.photo }));
      updateUser({ photo: response.photo });
      alert("✅ Profile picture updated successfully!");
    } catch (error) {
      alert("❌ Failed to upload picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-4">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {/* Header */}
          <div
            className="p-4 text-white d-flex align-items-center"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            <div className="position-relative me-4">
              <div
                className="rounded-circle overflow-hidden border border-3 border-white"
                style={{ width: "120px", height: "120px" }}
              >
                {profile.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace(
                      "/api",
                      ""
                    )}/${profile.profilePicture}`}
                    alt="Profile"
                    className="img-fluid h-100 w-100 object-fit-cover"
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-white h-100 text-secondary fs-1">
                    <i className="bi bi-person"></i>
                  </div>
                )}
              </div>
              <label className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm cursor-pointer">
                <i className="bi bi-camera text-primary"></i>
                <input type="file" accept="image/*" onChange={handlePictureUpload} hidden />
              </label>
            </div>
            <div>
              <h3 className="fw-bold mb-1">{profile.name || "User Name"}</h3>
              <p className="mb-1">{profile.position || "Position"}</p>
              <p className="mb-0">{profile.email || "Email"}</p>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs px-3 pt-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Information
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </button>
            </li>
          </ul>

          <div className="card-body">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={profile.name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={profile.email}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      value={profile.phoneNumber}
                      onChange={handleProfileChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      value={profile.position}
                      disabled
                    />
                  </div>
                </div>

                <div className="text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="mt-3">
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-warning px-4"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
