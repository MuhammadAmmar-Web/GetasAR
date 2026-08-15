import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary menangkap error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 w-screen h-screen bg-slate-900 flex flex-col items-center justify-center z-[9999] text-center p-6">
          <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-5">
            <span className="text-red-400 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-white font-bold text-lg mb-2">Terjadi Kesalahan</h1>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            Maaf, ada kendala saat menampilkan halaman. Silakan coba lagi.
          </p>
          <button
            onClick={this.handleReset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
