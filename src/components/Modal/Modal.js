import React from 'react';

import cl from './modal.module.scss'

function Modal({children, title, noRedirect, github}) {
    return ( 
        <div className={cl.modal}>
            <div className={cl.modal__content}>
                <div className={cl.title}>{title}</div>
                            <div className={cl.content}>
                                {children} 
                                {!noRedirect ? <span className={cl.span}>For back click back button in browser or you will spawn at start</span> : null} 
                            </div>
                            <div className={cl.menu}>
                                <div> press Esc to close</div>
                                {!noRedirect ? <div> press Enter to open app</div> : null}
                            </div>
            </div>
        </div>
     );
}

export default Modal;