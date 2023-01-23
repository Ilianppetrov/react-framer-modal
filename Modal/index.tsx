import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Close from "./close-icon";
import "./Modal.css";

const getModalRoot = () => {
  let ModalRoot = document.getElementById("modal-root");

  if (ModalRoot === null) {
    ModalRoot = document.createElement("div");
    ModalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(ModalRoot);
  }

  return ModalRoot;
};

interface ModalProps {
  children: React.ReactNode;
  isVisible: boolean;
  hide: () => void;
  layoutId?: string;
}

const Modal = ({ children, isVisible, hide, layoutId }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const eventCb = (e: any) => {
      if (e.key === "Escape") {
        hide();
      }
    };

    document.addEventListener("keydown", eventCb);

    return () => {
      document.removeEventListener("keydown", eventCb);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  const content = (
    <AnimatePresence>
      {isVisible ? (
        <>
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="Decarb-modal"
          ></motion.div>
          <div
            className="modal-container"
            onClick={(event) => {
              if (
                event.target &&
                !containerRef?.current?.contains(event.target as Node)
              ) {
                hide?.();
              }
            }}
          >
            <motion.div
              layoutId={layoutId}
              initial={!layoutId ? { y: "100%", opacity: 0.4 } : {}}
              animate={!layoutId ? { y: 0, opacity: 1 } : {}}
              exit={!layoutId ? { y: "100%", opacity: 0.4 } : {}}
              transition={{ duration: 0.6 }}
              ref={containerRef}
              className="modal"
            >
              <div className="close-btn" onClick={hide}>
                <Close />
              </div>
              {children}
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
  return ReactDOM.createPortal(content, getModalRoot());
};

type UseModalProps = {
  defaultState: boolean;
};

type ReturnType = {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
};

const useModal = (
  { defaultState }: UseModalProps = { defaultState: false }
): ReturnType => {
  const [isVisible, setIsVisible] = useState(defaultState);

  const hide = () => {
    setIsVisible(false);
  };

  const show = () => {
    setIsVisible(true);
  };
  return {
    isVisible,
    show,
    hide,
  };
};

export { useModal };
export default Modal;
