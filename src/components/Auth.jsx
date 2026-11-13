import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path if your client is in src/supabaseClient.js

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: username.trim() },
        },
      });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-1">
        {isSignUp ? 'Create Player Profile' : 'Sign In to Tip'}
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        {isSignUp
          ? 'Enter a display name to appear on your league leaderboard.'
          : 'Log in to manage your leagues and lock in your weekly picks.'}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Phil"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Log In'}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-slate-400">
        {isSignUp ? 'Already have an account?' : 'Need a player profile?'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-emerald-400 hover:underline font-medium"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}