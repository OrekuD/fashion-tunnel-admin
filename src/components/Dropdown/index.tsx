import React from "react";
import colors from "../../constants/colors";
import { ChevronRightIcon } from "../Icons";
import classes from "./index.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "../../constants";

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  options: Array<string>;
}

const Dropdown = (props: Props) => {
  return (
    <div className={classes["container-wrapper"]}>
      <p className={classes["label"]}>{props.label}</p>
      <div
        className={classes["container"]}
        onClick={() => props.setIsVisible((prevValue) => !prevValue)}
      >
        {props?.value ? (
          <p className={classes["label"]}>{props.value}</p>
        ) : (
          <p className={classes["placeholder"]}>{props.placeholder}</p>
        )}
        <ChevronRightIcon
          width={24}
          height={24}
          color={colors.deepgrey}
          style={{
            transform: `rotate(${props.isVisible ? "-90deg" : "90deg"})`,
          }}
        />
      </div>
      <AnimatePresence>
        {props.isVisible && (
          <motion.div
            initial={{
              opacity: 0,
              translateY: -12,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: {
                ease: ease,
              },
            }}
            exit={{
              opacity: 0,
              translateY: -12,
            }}
            className={classes["dropdown"]}
          >
            {props.options.map((option) => {
              const isSelected = option === props.value;
              return (
                <p
                  key={option}
                  onClick={() => props.onChange(option)}
                  style={{
                    backgroundColor: isSelected ? "#f8f9fc" : undefined,
                    fontWeight: isSelected ? 500 : undefined,
                  }}
                >
                  {option}
                </p>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {props.error && <p className={classes["error"]}>{props.error}</p>}
    </div>
  );
};

export default Dropdown;
