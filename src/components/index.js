import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import Auth from "./Auth";
import { User } from "./Auth";

const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <Link to={`/login`}>Sign in</Link>
    </div>
  );
};

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={MainPage} />
      <Route exact path="/login" render={(props) => <LoginForm {...props} />} />
      <Route
        exact
        path="/registration"
        render={(props) => <RegistrationForm {...props} />}
      />
      <Route
        path="/auth/userId=:userId?&chatId=:chatId?"
        render={(props) => <Auth {...props} />}
      />
      <Route
        path="/auth/userId=:userId?"
        render={(props) => <Auth {...props} />}
      />
    </Switch>
  </BrowserRouter>
);
