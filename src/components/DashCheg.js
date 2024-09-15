import "../styles/Dash.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dte from "../dataCheg.json";

const ItensTitles = ["Viagem <RAP>", "Nome do Navio", "ETA", "Tipo de Escala"];

const regexRemoveHtmlAndProgramado =
  /<[^>]+>|\\u003C[^>]+\\u003E\s*PROGRAMADO/g;

function sanitizeText(text) {
  return text
    .replace(regexRemoveHtmlAndProgramado, "")
    .replace(/\s*PROGRAMADO/g, "");
}

export default function DashCheg() {
  const [aps, setAps] = useState([]);
  const [changedItems, setChangedItems] = useState([]); // Estado para armazenar itens alterados
  const apiCalled = useRef(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://portohackserver-git-main-gustavo-silva-nuschs-projects.vercel.app/cheg"
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
  }, []);

  const handleReset = () => {
    fetchData().then(() => {
      compare();
    });
  };

  return (
    <div className="Dash">
      <div className="controller">
        <h2>Aviso de Chegada</h2>
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
              <span className={`Itens${index % 2}item`}>
                {sanitizeText(item.numero_viagem)}
              </span>
              <span className={`Itens${index % 2}item`}>
                {sanitizeText(item.navio)}
              </span>
              <span className={`Itens${index % 2}item`}>
                {sanitizeText(item.entrada)}
              </span>
              <span className={`Itens${index % 2}item`}>
                {sanitizeText(item.tipoviagem)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
