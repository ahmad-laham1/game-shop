import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError("");
    }
    
    // Clear confirm password error when password changes
    if (field === "password" && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = "";
    
    switch (field) {
      case "username":
        if (!value.trim()) {
          error = "Username is required";
        } else if (value.length < 3) {
          error = "Username must be at least 3 characters";
        } else if (value.length > 30) {
          error = "Username must be no more than 30 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username can only contain letters, numbers, and underscores";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        } else if (value.length > 254) {
          error = "Email is too long";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (value.length > 128) {
          error = "Password is too long";
        }
        break;
        
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (password.length < 8) feedback.push("At least 8 characters");
    if (!/[a-z]/.test(password)) feedback.push("Lowercase letter");
    if (!/[A-Z]/.test(password)) feedback.push("Uppercase letter");
    if (!/[0-9]/.test(password)) feedback.push("Number");
    if (!/[^A-Za-z0-9]/.test(password)) feedback.push("Special character");
    
    const strengthMap = {
      0: { label: "Very Weak", color: "#ef4444" },
      1: { label: "Weak", color: "#f97316" },
      2: { label: "Fair", color: "#eab308" },
      3: { label: "Good", color: "#22c55e" },
      4: { label: "Strong", color: "#16a34a" },
      5: { label: "Very Strong", color: "#15803d" },
      6: { label: "Excellent", color: "#166534" },
    };
    
    return {
      score,
      label: strengthMap[score]?.label || "",
      color: strengthMap[score]?.color || "",
      feedback: feedback.length > 0 ? feedback : ["All requirements met!"]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await axios.post(`${API_BASE}/api/signup/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // Auto-login after successful signup
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      
      navigate("/products");
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            // Handle field-specific errors
            if (data.username) {
              setErrors(prev => ({ ...prev, username: data.username[0] }));
            }
            if (data.email) {
              setErrors(prev => ({ ...prev, email: data.email[0] }));
            }
            if (data.password) {
              setErrors(prev => ({ ...prev, password: data.password[0] }));
            }
            if (data.non_field_errors) {
              setSubmitError(data.non_field_errors[0]);
            }
            break;
            
          case 409:
            setSubmitError("Username or email already exists. Please choose different credentials.");
            break;
            
          case 500:
            setSubmitError("Server error. Please try again later.");
            break;
            
          default:
            setSubmitError("Signup failed. Please try again.");
            break;
        }
      } else if (error.request) {
        setSubmitError("Network error. Please check your connection and try again.");
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error) || submitError;
  const canSubmit = Object.values(formData).every(value => value.trim()) && !hasErrors && !isSubmitting;
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="signup-page">
      <div className="signup-container">
        <Card className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join us and start shopping for amazing games</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleChange("username")}
              onBlur={handleBlur("username")}
              placeholder="Choose a username"
              required
              minLength={3}
              maxLength={30}
              pattern="^[a-zA-Z0-9_]+$"
              error={errors.username}
              touched={touched.username}
              autoComplete="username"
              disabled={isSubmitting}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="Enter your email"
              required
              maxLength={254}
              error={errors.email}
              touched={touched.email}
              autoComplete="email"
              disabled={isSubmitting}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              placeholder="Create a strong password"
              required
              minLength={8}
              maxLength={128}
              error={errors.password}
              touched={touched.password}
              autoComplete="new-password"
              disabled={isSubmitting}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  />
                </div>
                <div className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </div>
                <div className="strength-feedback">
                  {passwordStrength.feedback.map((item, index) => (
                    <span key={index} className="feedback-item">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              autoComplete="new-password"
              disabled={isSubmitting}
            />

            {submitError && (
              <div className="form-error">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              className="signup-submit"
              disabled={!canSubmit}
              loading={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="signup-footer">
            <p className="signup-help">
              Already have an account?{" "}
              <Link to="/login" className="signup-link">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
