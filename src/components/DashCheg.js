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
  const apiCalled = useRef(false);

  // Função para buscar os dados da API
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

  // Função para comparar e atualizar os dados
  const compare = () => {
    dte.forEach((dteObj, index) => {
      let matchingObjB = aps.find((objB) => {
        return Object.keys(dteObj).every((key) => dteObj[key] === objB[key]);
      });

      if (matchingObjB) {
        compareObjects(dteObj, matchingObjB);
      } else {
        console.log(
          `Atualizando dteObj com dados de aps[${index}]:`,
          aps[index]
        );
        Object.assign(dteObj, aps[index]);
      }
    });

    console.log("dte atualizado:", dte);
  };

  // Função para comparar objetos
  function compareObjects(objA, objB) {
    for (let key in objA) {
      if (key !== "viagem" && objA[key] !== objB[key]) {
        console.log(
          `Difference found in key: ${key}, A: ${objA[key]} ${objA.duv}, B: ${objB[key]} ${objB.duv}`
        );
      }
    }
  }

  // Efeito para carregar os dados ao montar o componente
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
            <div className={`Itens${index % 2}`} key={index}>
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
