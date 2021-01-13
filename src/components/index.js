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
      <Link to={`/myproject/login`}>Sign in</Link>
    </div>
  );
};

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/myproject" component={MainPage} />
      <Route exact path="/myproject/login" render={(props) => <LoginForm {...props} />} />
      <Route
        exact
        path="/myproject/registration"
        render={(props) => <RegistrationForm {...props} />}
      />
      <Route
        path="/myproject/auth/userId=:userId?&chatId=:chatId?"
        render={(props) => <Auth {...props} />}
      />
      <Route
        path="/myproject/auth/userId=:userId?"
        render={(props) => <Auth {...props} />}
      />
    </Switch>
  </BrowserRouter>
);
