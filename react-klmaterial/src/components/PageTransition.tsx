import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './PageTransition.css';

interface PageTransitionProps {
  children?: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const nodeRef = React.useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        nodeRef={nodeRef}
        timeout={600}
        classNames="page"
        unmountOnExit
      >
        <div ref={nodeRef} className="page-wrapper">
          {currentOutlet}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageTransition;
