import "../styles/Drawer.css";

export default function Drawer({ setDash }) {
  const handleSetDash = (index) => {
    setDash(index);
  };
  return (
    <div className="Drawer">
      <div onClick={() => handleSetDash(0)} className="DrawerItem">
        Atracação Prevista
      </div>
      <div onClick={() => handleSetDash(1)} className="DrawerItem">
        Atracação de Chegada
      </div>
    </div>
  );
}
