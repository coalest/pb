import type { FC } from "react";
import "./styles/reset.css";
import "./styles/variables.css";
import "./App.css";

import { ToastContainer } from "react-toastify";

import { GameProvider } from "./context/GameContext";

import Header from "./components/Header/Header.tsx";
import Prediction from "./components/Prediction/Prediction.tsx";
import Game from "./components/Game/Game.tsx";
import Statistics from "./components/Statistics/Statistics.tsx";

const App: FC = () => {
  return (
    <GameProvider>
      <ToastContainer />
      <div className="app">
        <Header />
        <Prediction />
        <Game />
        <Statistics />
      </div>
    </GameProvider>
  );
};

export default App;
