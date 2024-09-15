import "../styles/Dashboard.css";

import Drawer from "../components/Drawer";
import DashPrev from "../components/Dash";
import DashCheg from "../components/DashCheg";
import { useState } from "react";

export default function Dashboard() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="background">
      <Drawer setDash={setSelected} />
      {selected === 0 ? <DashPrev /> : <DashCheg />}
    </div>
  );
}
