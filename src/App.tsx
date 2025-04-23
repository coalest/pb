import React from "react";
import "./styles/reset.css";
import "./App.css";

import { ToastContainer } from "react-toastify";

import { UserProvider } from "./context/UserContext";
import { GameProvider } from "./context/GameContext";

import Header from "./components/Header/Header.tsx";
import Prediction from "./components/Prediction/Prediction.tsx";
import Game from "./components/Game/Game.tsx";
import Statistics from "./components/Statistics/Statistics.tsx";

const App: React.FC = () => {
  return (
    <UserProvider>
      <ToastContainer />
      <GameProvider>
        <div className="app">
          <Header />
          <Prediction />
          <Game />
          <Statistics />
        </div>
      </GameProvider>
    </UserProvider>
  );
};

export default App;
