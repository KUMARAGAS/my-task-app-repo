import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/authSlice";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("tm_token");
    const storedUser = localStorage.getItem("tm_user");
    if (storedToken && storedUser) {
      try {
        dispatch(setCredentials({
          token: storedToken,
          user: JSON.parse(storedUser),
        }));
      } catch {
        localStorage.removeItem("tm_token");
        localStorage.removeItem("tm_user");
      }
    }
  }, [dispatch]);

  return children;
}