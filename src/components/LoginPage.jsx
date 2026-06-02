import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email address is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // proceed with login
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left-panel">
        <div className="login-logo">Logo</div>
        <div className="login-lottie-wrapper">
          <img
            className="login-lottie"
            src="https://assets9.lottiefiles.com/packages/lf20_3ueg3po6.json"
            alt="animation"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="login-lottie-fallback" aria-hidden="true" />
        </div>
        <div className="login-check-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 5" stroke="#07AD36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel">
        <button className="login-back-btn" type="button">
          <svg className="login-back-icon" width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path d="M8 1L1 8L8 15" stroke="#8591A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back</span>
        </button>

        <div className="login-box">
          <h1 className="login-title">Account Login</h1>
          <hr className="login-divider" />
          <p className="login-description">
            If you are already a member you can login with your email address and password.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label" htmlFor="email">Email address</label>
              <input
                id="email"
                className={`login-input${errors.email ? ' login-input--error' : ''}`}
                type="email"
                placeholder="sampleuser@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <span id="email-error" className="login-field-error" role="alert">{errors.email}</span>}
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                id="password"
                className={`login-input${errors.password ? ' login-input--error' : ''}`}
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                autoComplete="current-password"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && <span id="password-error" className="login-field-error" role="alert">{errors.password}</span>}
            </div>

            <div className="login-remember-row">
              <label className="login-checkbox-label">
                <span className={`login-checkbox ${rememberMe ? 'login-checkbox--checked' : ''}`}
                  role="checkbox"
                  aria-checked={rememberMe}
                  tabIndex={0}
                  onClick={() => setRememberMe(!rememberMe)}
                  onKeyDown={(e) => e.key === ' ' && setRememberMe(!rememberMe)}
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="login-remember-text">Remember me</span>
              </label>
            </div>

            <button className="login-submit-btn" type="submit">
              Login
            </button>
          </form>

          <p className="login-signup-prompt">
            Dont have an account ?{' '}
            <a className="login-signup-link" href="#">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
