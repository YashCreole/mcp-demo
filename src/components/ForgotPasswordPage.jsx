import { useState } from 'react';
import './ForgotPasswordPage.css';
import heroImg from '../assets/hero.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResend = () => {
    setSubmitted(false);
  };

  return (
    <div className="fp-page">
      {/* Left Panel */}
      <div className="fp-left-panel" aria-hidden="true">
        <div className="fp-logo">Logo</div>
        <img
          className="fp-illustration"
          src={heroImg}
          alt=""
        />
      </div>

      {/* Right Panel */}
      <div className="fp-right-panel">
        <button className="fp-back-btn" type="button" aria-label="Go back">
          <svg className="fp-back-icon" width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
            <path d="M8 1L1 8L8 15" stroke="#8591A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back</span>
        </button>

        <div className="fp-box">
          <h1 className="fp-title">Forgot Password?</h1>
          <p className="fp-description">
            We will send you a reset password link in this email address
          </p>

          <form className="fp-form" onSubmit={handleSubmit} noValidate>
            <div className="fp-field">
              <label className="fp-label" htmlFor="fp-email">Email address</label>
              <input
                id="fp-email"
                className={`fp-input${error ? ' fp-input--error' : ''}`}
                type="email"
                placeholder="sampleuser@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="email"
                aria-describedby={error ? 'fp-email-error' : undefined}
                aria-invalid={!!error}
              />
              {error && (
                <span id="fp-email-error" className="fp-field-error" role="alert">
                  {error}
                </span>
              )}
            </div>

            {submitted && (
              <p className="fp-success" role="status">
                A reset link has been sent to <strong>{email}</strong>.
              </p>
            )}

            <button className="fp-submit-btn" type="submit">
              Send Password Reset Link
            </button>
          </form>

          <button
            className="fp-resend-btn"
            type="button"
            onClick={handleResend}
          >
            Resend Link
          </button>
        </div>
      </div>
    </div>
  );
}
