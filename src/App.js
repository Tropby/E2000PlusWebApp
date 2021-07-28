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

class App extends React.Component {

    state = {
        rooms: [],
        categories: [],
        ports: [],
        loggers: [],
        connection: new E2000API("192.168.222.92", 443)
    }

    constructor() {
        super();
        setTimeout(
            function refreshTokens() {
                this.state.connection.refreshToken();
            }.bind(this),
            5000
        );
        this.updatePort = this.updatePort.bind(this);
    }

    getData(id, start, end) {
        return this.state.connection.loggerData(id, start, end);
    }

    updatePort(type, id, port, value) {
        this.state.connection.setPort(type, id, port, value);
    };

    componentDidMount() {
        let state = this.state;

        state.connection.onWebsocketLoggedIn = () => {
            state.connection.busData(true);
            state.connection.startPortTransfer();
        };

        state.connection.onPortChanged = function(data) {
            let name = data.name.split(".");
            let type = name[0];
            let id = name[1];
            let port = name[2];
            let value = data.value;

            switch (type)
            {
                case "OUT":
                    this.setState(state => {
                        state.rooms.forEach((element) => {
                            element.ports.forEach((element) => {
                                if (element.ID === id)
                                {
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

        this.state.connection.login("admin", "a25kj69s").then(
            function(){
                state.connection.portData().then((data) => {

                    state.connection.logger().then((data) => {

                        data.logger.forEach(e => {
                            e.getData = this.getData.bind(this);
                        });
                        this.setState({ loggers: data.logger });                        
                    });


                    let rooms = [];
                    let categories = [];
                    let knownRooms = [];
                    let knownCategories = [];

                    data.ports.forEach(element => {

                        element.outputs.forEach(out => {
                            out.updatePort = this.updatePort
                        });

                        if (!knownRooms.includes(element.vars.ROOM))
                        {
                            if (element.vars.ROOM !== "" && typeof element.vars.ROOM !== "undefined") {
                                knownRooms.push(element.vars.ROOM);
                                let o = {
                                    name: element.vars.ROOM,
                                    ports: []
                                };
                                rooms.push(o);
                            }
                        }

                        if (!knownCategories.includes(element.vars.CATEGORIE)) {

                            if (element.vars.CATEGORIE !== "" && typeof element.vars.CATEGORIE !== "undefined")
                            {
                                knownCategories.push(element.vars.CATEGORIE);
                                let o = {
                                    name: element.vars.CATEGORIE,
                                    ports: []
                                };
                                categories.push(o);
                            }
                        }
                        
                        if (element.vars.ROOM)
                        {
                            let room = rooms.find(e => e.name === element.vars.ROOM);
                            room.ports.push(element);
                        }

                        if (element.vars.CATEGORIE)
                        {
                            let category = categories.find(e => e.name === element.vars.CATEGORIE);
                            category.ports.push(element);
                        }
                    });

                    this.setState(
                        {
                            rooms: rooms,
                            categories: categories
                        }
                    )

                    state.connection.webSocketConnect();
                });
            }.bind(this)
        );
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <div className="page">
                            <h1>E2000 Plus - GUI</h1>
                        </div>
                    </Route>
                    <Route path="/devices">
                        <Connections connection={this.state.connection} />
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
                    <Link to="/devices">Devices</Link>
                    <Link to="/rooms">Rooms</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/loggers">Logger</Link>
                </div>
            </Router>
        );
    }
}

export default App;

