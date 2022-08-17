import React from 'react';

import cl from './openModal.module.scss'

function OpenModal() {
    return ( 
        <div className={cl.modal}>
            <div className={cl.modal__content}>
                Press Enter to read
            </div>
        </div>
     );
}

export default OpenModal;