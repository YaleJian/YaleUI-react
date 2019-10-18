import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import "normalize.css";
import * as serviceWorker from './serviceWorker';
import {Route, Switch} from "react-router";
import {BrowserRouter} from "react-router-dom";
import Login from './modules/Login/Login';
import ApiPage from "./pages/api/ApiPage";
import Base from "./pages/common/Base";
import AppDownload from "./modules/AppDownload/AppDownload";

let root = <>
    <Login/>
    <BrowserRouter>
        <Switch>
            <Route exact path={'/'} component={Base}/>
            <Route path={'/api'} component={ApiPage}/>
            <Route path={'/appDownload'} component={AppDownload}/>
        </Switch>
    </BrowserRouter>
</>;
ReactDOM.render(root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();