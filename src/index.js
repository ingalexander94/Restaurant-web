import React from "react";
import ReactDOM from "react-dom";
import RestaurantApp from "./RestaurantApp";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<RestaurantApp />, document.getElementById("root"));

serviceWorker.unregister();
