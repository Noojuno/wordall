import classNames from "classnames";
import styles from "./Button.module.scss";

type ReactElement = JSX.Element | JSX.Element[] | string | string[];

interface ButtonProps {
  children?: ReactElement;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function Button({ children, className, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, className, {
        [styles.button__disabled]: disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
