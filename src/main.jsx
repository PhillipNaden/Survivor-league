import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class MobileSafeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Something went wrong loading the app</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>{this.state.errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold' }}
          >
            Tap to Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MobileSafeErrorBoundary>
      <App />
    </MobileSafeErrorBoundary>
  </React.StrictMode>
);