import React from "react";
import ReactDom from "react-dom";
import AppComponent from "./components/App";

const App = React.createFactory(AppComponent);
const mountNode = document.getElementById("app-mount");
const serverState: any = (<any>window).state;
ReactDom.hydrate(App(serverState), mountNode);
