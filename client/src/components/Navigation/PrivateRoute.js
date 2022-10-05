import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Home from '../Home';
import SignIn from '../SignIn';
import Landing from '../Landing';
import history from './history';
import Search from '../Search';
import Reviews from '../Reviews';
import TopMovies from '../TopMovies';

export default function PrivateRoute({

}) {
  return (

    <Router history={history}>
      <Switch>
      <Route path="/Home" exact component={Home} />
      <Route path="/SignIn" exact component={SignIn} />
      <Route path="/" exact component={Landing} />
      <Route path="/Search" exact component={Search} />
      <Route path="/Reviews" exact component={Reviews} />
      <Route path="/TopMovies" exact component={TopMovies} />
      </Switch>
    </Router>
  );
}