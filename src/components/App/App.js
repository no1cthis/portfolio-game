import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import './app.module.scss'

import Game from "../Game/Game";
import OpenModal from "../OpenModal/OpenModal";
import WelcomeBoard from "../Boards/WelcomeBoard/WelcomeBoard";


import HolographBoard from "../Boards/HolographBoard/HolographBoard";
import BgBoard from "../Boards/BgBoard/BgBoard";
import TestCompany1Board from "../Boards/TestCompany1Board/TestCompany1Board";
import WeatherBoard from "../Boards/WeatherBoard/WeatherBoard";
import CodeEditorBoard from "../Boards/CodeEditorBoard/CodeEditorBoard";
import ComingSoonBoard from "../Boards/ComingSoonBoard/ComingSoonBoard";


function App() {
  const location = useLocation();
  const [isOpenModal, setOpenModal] = useState(false)  
  const [modals, setModal] = useState({
    welcomePage:    false,
    holograph:      false,
    bg:             false,
    signUp:         false,
    weather:        false,
    codeEditor:     false,
    comingSoon:     false
  })

  const isModalOpen = () =>{
    for(let key in modals){
      if (modals[key] == true)
        return true
    }
    return false
  }

  function game(){
    return(
    <>
          <Game isOpenModal = {isOpenModal} setOpenModal = {setOpenModal} modals = {modals} setModal = {setModal}/>
          {isOpenModal && !isModalOpen() ? <OpenModal isOpenModal={isOpenModal}/> : null}
          {modals.welcomePage        ?     <WelcomeBoard/>       : null}
          {modals.codeEditor         ?     <CodeEditorBoard/>    : null}
          {modals.comingSoon         ?     <ComingSoonBoard/>    : null}
          {modals.holograph          ?     <HolographBoard/>     : null}
          {modals.bg                 ?     <BgBoard/>            : null}
          {modals.testCompany1       ?     <TestCompany1Board/>  : null}
          {modals.weather            ?     <WeatherBoard/>       : null}
    </>
    )
  }

  return (
    <>
          <AnimatePresence exitBeforeEnter initial={false}>
              <Routes location={location} key={location.pathname}>
                  <Route path="/"                       element={game()}/>
              </Routes>
          </AnimatePresence>
    </>
  );
}


export default App;
