import React from "react";
import "./styles/reset.css";
import "./App.css";

import { UserProvider } from "./context/UserContext";

import Header from "./components/Header/Header.tsx";
import Prediction from "./components/Prediction/Prediction.tsx";
import Game from "./components/Game/Game.tsx";
import Statistics from "./components/Statistics/Statistics.tsx";

const App: React.FC = () => {
  return (
    <UserProvider>
      <div className="app">
        <Header />
        <Prediction />
        <Game />
        <Statistics />
      </div>
    </UserProvider>
  );
};

export default App;
