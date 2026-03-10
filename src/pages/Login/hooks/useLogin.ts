import { useState } from "react";
import { authService } from "../../../app/services/authService";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../../../app/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login({ username, password });

      if (result.success && result.user) {
        dispatch(
          setCredentials({
            token: "app_password_authenticated",
            userName: result.user.name || "User",
          })
        );

        console.log(
          "👤 Login successful with Application Password for:",
          result.user.name
        );

        navigate("/dashboard");
      } else {
        console.error("❌ Login failed:", result.message || "Unknown error");

        setError(
          result.message ||
            "Ошибка входа. Проверьте настройки Application Password."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};