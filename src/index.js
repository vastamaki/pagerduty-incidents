import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GetView from "./GetView";
import { Provider } from "./Context";
import Notification from "./Components/Notification/";
import Settings from "./Components/Settings/index"
import Cards from "./Components/Settings/Cards"
import Teams from "./Components/Settings/Teams"
import Filters from "./Components/Settings/Filters"
import Sorting from "./Components/Settings/Sorting"
import "./index.css";

const routes = (
  <Provider>
    <Notification />
    <Settings />
    <Cards />
    <Teams />
    <Filters />
    <Sorting />
    <Router>
      <Switch>
        <Route exact path="/" component={GetView} />
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById("root"));
