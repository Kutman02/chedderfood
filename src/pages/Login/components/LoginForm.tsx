import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const { login, isLoading, error } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase">
          Burger Food
        </h1>

        <p className="text-sm text-slate-500 font-medium mt-1">
          Панель оператора
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Логин
          </label>

          <input
            type="text"
            className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите логин..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Пароль
          </label>

          <input
            type="password"
            className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold uppercase hover:bg-orange-600 transition-all disabled:opacity-50"
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};