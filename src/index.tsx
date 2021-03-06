import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryParamProvider } from "use-query-params";
import { ToastProvider } from "./lib/toast";

ReactDOM.render(
  <React.StrictMode>
    <QueryParamProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryParamProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
