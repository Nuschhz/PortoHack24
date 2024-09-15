import "../styles/Dash.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dte from "../dataPrev.json";

const ItensTitles = [
  "Viagem",
  "Navio",
  "Armazém",
  "Nome do Navio",
  "ETA",
  "ATB",
  "Hora",
  "Manobra",
];

export default function Dash() {
  const [aps, setAps] = useState([]);
  const [changedItems, setChangedItems] = useState([]);
  const apiCalled = useRef(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://portohackserver-git-main-gustavo-silva-nuschs-projects.vercel.app/prev"
      );
      setAps(response.data);
    } catch (error) {
      console.error("Error fetching port data:", error);
    }
  };

  const compare = () => {
    const changedIndexes = [];

    dte.forEach((dteObj, index) => {
      let matchingObjB = aps.find((objB) => {
        return Object.keys(dteObj).every((key) => dteObj[key] === objB[key]);
      });

      if (matchingObjB) {
        const isChanged = compareObjects(dteObj, matchingObjB);
        if (isChanged) {
          changedIndexes.push(index);
        }
      } else {
        console.log(
          `Atualizando dteObj com dados de aps[${index}]:`,
          aps[index]
        );
        Object.assign(dteObj, aps[index]);
        changedIndexes.push(index);
      }
    });

    setChangedItems(changedIndexes);
    console.log("dte atualizado:", dte);
  };

  function compareObjects(objA, objB) {
    let hasChanged = false;
    for (let key in objA) {
      if (key !== "viagem" && objA[key] !== objB[key]) {
        console.log(
          `Difference found in key: ${key}, A: ${objA[key]} ${objA.duv}, B: ${objB[key]} ${objB.duv}`
        );
        hasChanged = true;
      }
    }
    return hasChanged;
  }

  useEffect(() => {
    if (!apiCalled.current) {
      fetchData();
      apiCalled.current = true;
    }

    const intervalId = setInterval(() => {
      fetchData().then(() => {
        compare();
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [aps]);

  const handleReset = () => {
    fetchData().then(() => {
      compare();
    });
  };

  return (
    <div className="Dash">
      <div className="controller">
        <h2>Atracação Prevista / Efetiva / Desatracação</h2>
        <div onClick={handleReset} className="reset">
          Reset
        </div>
      </div>
      <div className="DashCard">
        <div className="Titles">
          {ItensTitles.map((title, index) => (
            <span className="ItensTitles" key={index}>
              {title}
            </span>
          ))}
        </div>
        <div className="itemContainer">
          {dte.map((item, index) => (
            <div
              className={`Itens${index % 2} ${
                changedItems.includes(index) ? "changed" : ""
              }`}
              key={index}
            >
              <span className={`Itens${index % 2}item`}>{item.viagem}</span>
              <span className={`Itens${index % 2}item`}>{item.imo}</span>
              <span className={`Itens${index % 2}item`}>{item.local}</span>
              <span className={`Itens${index % 2}item`}>{item.nomenavio}</span>
              <span className={`Itens${index % 2}item`}>{item.data}</span>
              <span className={`Itens${index % 2}item`}>{item.eta}</span>
              <span className={`Itens${index % 2}item`}>{item.periodo}</span>
              <span className={`Itens${index % 2}item`}>{item.manobra}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
