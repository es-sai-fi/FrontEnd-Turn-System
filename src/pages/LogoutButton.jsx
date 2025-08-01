import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import Swal from "sweetalert2";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();

    if (result.success) {
      Swal.fire({
        title: "✅ Sesión cerrada",
        text: "Has cerrado sesión correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "⚠️ Cierre local de sesión",
        text: "No se pudo invalidar en el servidor, pero tu sesión se cerró en este dispositivo.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }

    // 🧹 Limpieza de datos locales
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role_id");
    localStorage.removeItem("user_name");

    // 🔄 Redirigimos al login
    navigate("/");
  };

  return (
    <div className="logout-container">
        <button onClick={handleLogout} className="btn-primary">
        🚪 Cerrar sesión
        </button>
    </div>
    );
}

export default LogoutButton;
