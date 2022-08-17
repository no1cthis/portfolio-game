import React from 'react';
import Modal from '../../Modal/Modal';

import cl from './welcomeBoard.module.scss'

function WelcomeBoard() {
    return ( 
              <Modal title={'Welcome Board'} noRedirect>
                    Hi, it's something like portfolio-game.<br/>
                    I do front-end few months and it's demo version of game.<br/>
                    It's nothing interesting now, <br/>but will be better (I hope)
                    <span className={cl.span}>Be careful with resize you can stuck!</span>
              </Modal>
     );
}

export default WelcomeBoard;