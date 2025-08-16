import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
        
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      await login(formData.username, formData.password);
      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different types of errors
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            if (data.username) {
              setErrors(prev => ({ ...prev, username: data.username[0] }));
            } else if (data.password) {
              setErrors(prev => ({ ...prev, password: data.password[0] }));
            } else if (data.non_field_errors) {
              setSubmitError(data.non_field_errors[0]);
            } else {
              setSubmitError("Invalid credentials. Please try again.");
            }
            break;
            
          case 401:
            setSubmitError("Invalid username or password.");
            break;
            
          case 429:
            setSubmitError("Too many login attempts. Please wait a moment and try again.");
            break;
            
          case 500:
            setSubmitError("Server error. Please try again later.");
            break;
            
          default:
            setSubmitError("Login failed. Please try again.");
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

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleChange("username")}
              onBlur={handleBlur("username")}
              placeholder="Enter your username"
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
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              placeholder="Enter your password"
              required
              minLength={8}
              error={errors.password}
              touched={touched.password}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            {submitError && (
              <div className="form-error">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              className="login-submit"
              disabled={!canSubmit}
              loading={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="login-footer">
            <p className="login-help">
              Don't have an account?{" "}
              <Link to="/signup" className="login-link">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
