import classNames from "classnames";
import { useContext } from "react";
import { ToastContext } from "../lib/toast";

import styles from "./ToastMessage.module.scss";

export function ToastMessage() {
  const toast = useContext(ToastContext);

  if (!toast || !toast.message) return <></>;

  const { visible } = toast;

  return (
    <div className={classNames(styles.toast, { [styles.fadein]: visible, [styles.fadeout]: !visible })}>
      <h2>{toast.message}</h2>
    </div>
  );
}
