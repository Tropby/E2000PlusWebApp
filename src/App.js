import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import E2000API from "./E2000API"
import Connections from "./components/connections/Connections.js"
import Rooms from "./components/rooms/Rooms.js"
import Categories from "./components/categories/Categories.js"
import Loggers from "./components/loggers/Loggers.js"

import "./css/index.css"
import "./css/bg.svg"
import "./css/room.svg"

class App extends React.Component {

    state = {
        rooms: [],
        categories: [],
        ports: [],
        loggers: [],
        connection: new E2000API(window.location.hostname, (window.location.port ? window.location.port : (window.location.protocol === "https:" ? 443 : 80)))
    }

    constructor() {
        super();

        if (localStorage.key("host") !== null)
            this.state.connection.host = localStorage.getItem("host");
        if (localStorage.key("port") !== null)
            this.state.connection.port = localStorage.getItem("port");
        if (localStorage.key("username") !== null)
            this.state.connection.username = localStorage.getItem("username");
        if (localStorage.key("password") !== null)
            this.state.connection.password = localStorage.getItem("password");

        this.setRooms = this.setRooms.bind(this);
        this.setCategories = this.setCategories.bind(this);
        this.setLogger = this.setLogger.bind(this);
        this.updateToken = this.updateToken.bind(this);

        this.updateToken();

        document.addEventListener("visibilitychange", function () {
            console.log("visibilitychange");
            if (document.hidden) {
                console.log("hidden!");            
            }
            else {
                this.updateToken();
            }
        }.bind(this), false);
    }

    updateToken() {

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        if (!this.state.connection.isConnected && window.location.href !== "/app/index.htm#/devices") {
            window.location.href = "/app/index.htm#/devices";
        }
        
        if (!document.hidden)
        {
            if (this.state.connection.isConnected)
            {
                this.state.connection.refreshToken().then(
                    (token) => { 
                        this.state.connection.webSocketPing();
                    },
                    (error) => {
                        console.log("error", error);
                    });
            }
            
            this.updateTimer = setTimeout(this.updateToken, 5000);
        }
    }

    setRooms(rooms) {
        this.setState(
            {
                rooms: rooms
            }
        )
    }

    setLogger(logger) {
        this.setState({ loggers: logger });
    }

    setCategories(categories) {
        this.setState(
            {
                categories: categories
            }
        )
    }

    componentDidMount() {
        let state = this.state;

        state.connection.onWebsocketLoggedIn = () => {
            state.connection.busData(true);
            state.connection.startPortTransfer();
        };

        state.connection.onPortChanged = function (data) {
            let name = data.name.split(".");
            let type = name[0];
            let id = name[1];
            let port = name[2];
            let value = data.value;

            switch (type) {
                case "OUT":
                    this.setState(state => {
                        state.rooms.forEach((element) => {
                            element.ports.forEach((element) => {
                                if (element.ID === id) {
                                    element.outputs[port].value = parseFloat(value);
                                }
                            });
                        });

                        state.categories.forEach((element) => {
                            element.ports.forEach((element) => {
                                if (element.ID === id) {
                                    element.outputs[port].value = parseFloat(value);
                                }
                            });
                        });

                        return state;
                    });
                    break;

                case "IN":
                    this.setState(state => {
                        state.rooms.forEach((element) => {
                            element.ports.forEach((element) => {
                                if (element.ID === id) {
                                    element.inputs[port].value = parseFloat(value);
                                }
                            });
                        });

                        state.categories.forEach((element) => {
                            element.ports.forEach((element) => {
                                if (element.ID === id) {
                                    element.inputs[port].value = parseFloat(value);
                                }
                            });
                        });

                        return state;
                    });
                    break;

                default:
                    break;
            }
        }.bind(this);
    }

    render() {
        return (
            <>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <div className="page">
                                <h1>E2000 Plus - GUI</h1>
                            </div>
                        </Route>
                        <Route path="/devices">
                            <Connections connection={this.state.connection} setRooms={this.setRooms} setCategories={this.setCategories} setLogger={this.setLogger} />
                        </Route>
                        <Route path="/rooms">
                            <Rooms rooms={this.state.rooms} />
                        </Route>
                        <Route path="/categories">
                            <Categories categories={this.state.categories} />
                        </Route>
                        <Route path="/loggers">
                            <Loggers loggers={this.state.loggers} />
                        </Route>
                    </Switch>
                    <div id="navbar">
                        <Link to="/devices" id="deviceLink"></Link>
                        <Link to="/rooms" id="roomLink"></Link>
                        <Link to="/categories" id="categoryLink"></Link>
                        <Link to="/loggers" id="loggerLink"></Link>
                    </div>
                </Router>
            </>
        );
    }
}

export default App;

