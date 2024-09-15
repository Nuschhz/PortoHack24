import "../styles/Drawer.css";
import logo from "../assets/logo-abtra-associacao-brasileira-de-terminais-e-recintos-alfandegados.png";
import { useState } from "react";

export default function Drawer({ setDash }) {
  const [select, setSelect] = useState(0);
  const handleSetDash = (index) => {
    setDash(index);
    setSelect(index);
  };
  return (
    <div className="Drawer">
      <img src={logo} alt="Logo ABTRA" />
      <div
        onClick={() => handleSetDash(0)}
        style={
          select === 0
            ? { backgroundColor: "#ff5d1b", color: "#fafafa" }
            : { backgroundColor: "#fafafa", color: "#ff5d1b" }
        }
        className="DrawerItem"
      >
        Atracação Prevista
      </div>
      <div
        onClick={() => handleSetDash(1)}
        style={
          select === 1
            ? { backgroundColor: "#ff5d1b", color: "#fafafa" }
            : { backgroundColor: "#fafafa", color: "#ff5d1b" }
        }
        className="DrawerItem"
      >
        Atracação de Chegada
      </div>
    </div>
  );
}
