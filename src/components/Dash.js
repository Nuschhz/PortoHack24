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
  const [aps, setAps] = useState([]); // Estado que armazena os dados da API
  const [changedItems, setChangedItems] = useState([]); // Estado para armazenar os itens alterados
  const apiCalled = useRef(false);

  // Função para buscar os dados da API
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

  // Função para comparar e atualizar os dados
  const compare = () => {
    const changedIndexes = []; // Lista para armazenar os índices alterados

    dte.forEach((dteObj, index) => {
      let matchingObjB = aps.find((objB) => {
        return Object.keys(dteObj).every((key) => dteObj[key] === objB[key]);
      });

      if (matchingObjB) {
        const isChanged = compareObjects(dteObj, matchingObjB);
        if (isChanged) {
          changedIndexes.push(index); // Adiciona o índice alterado
        }
      } else {
        console.log(
          `Atualizando dteObj com dados de aps[${index}]:`,
          aps[index]
        );
        Object.assign(dteObj, aps[index]);
        changedIndexes.push(index); // Marca como alterado se o objeto foi atualizado
      }
    });

    setChangedItems(changedIndexes); // Atualiza os itens alterados
    console.log("dte atualizado:", dte);
  };

  // Função para comparar objetos
  function compareObjects(objA, objB) {
    let hasChanged = false;
    for (let key in objA) {
      if (key !== "viagem" && objA[key] !== objB[key]) {
        console.log(
          `Difference found in key: ${key}, A: ${objA[key]} ${objA.duv}, B: ${objB[key]} ${objB.duv}`
        );
        hasChanged = true; // Define que houve uma alteração
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

  // Handler que será chamado ao clicar no botão reset
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
              }`} // Classe condicional para itens alterados
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
