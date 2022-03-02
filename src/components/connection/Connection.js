import React from "react";

class Connection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connection: this.props.connection
        };
        this.connect = this.connect.bind(this);
        this.hostChanged = this.hostChanged.bind(this);
        this.portChanged = this.portChanged.bind(this);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);

        this.updatePort = this.updatePort.bind(this);

        if (localStorage.key("host") !== null) {
            this.connect();
        }
    }

    getData(id, start, end) {
        return this.state.connection.loggerData(id, start, end);
    }

    updatePort(type, id, port, value) {
        this.state.connection.setPort(type, id, port, value);
    }

    connect() {

        localStorage.setItem("username", this.state.connection.username);
        localStorage.setItem("password", this.state.connection.password);
        localStorage.setItem("host", this.state.connection.host);
        localStorage.setItem("port", this.state.connection.port);

        let state = this.state;
        this.state.connection.login().then(
            function () {
                this.setState({ connection: state.connection });

                state.connection.portData().then((data) => {

                    state.connection.logger().then((data) => {

                        data.logger.forEach(e => {
                            e.getData = this.getData.bind(this);
                        });

                        this.props.setLogger(data.logger);
                    }, (error) => {
                        state.connection.token = false;
                        this.setState({ connection: state.connection });
                        this.setState({ errorMessage: "Get logger failed [" + error.data.message + "]" });
                    });


                    let rooms = [];
                    let categories = [];
                    let knownRooms = [];
                    let knownCategories = [];

                    data.ports.forEach(element => {

                        element.outputs.forEach(out => {
                            out.updatePort = this.updatePort
                        });

                        if (!knownRooms.includes(element.vars.ROOM)) {
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

                            if (element.vars.CATEGORIE !== "" && typeof element.vars.CATEGORIE !== "undefined") {
                                knownCategories.push(element.vars.CATEGORIE);
                                let o = {
                                    name: element.vars.CATEGORIE,
                                    ports: []
                                };
                                categories.push(o);
                            }
                        }

                        if (element.vars.ROOM) {
                            let room = rooms.find(e => e.name === element.vars.ROOM);
                            room.ports.push(element);
                        }

                        if (element.vars.CATEGORIE) {
                            let category = categories.find(e => e.name === element.vars.CATEGORIE);
                            category.ports.push(element);
                        }
                    });


                    this.props.setRooms(rooms);
                    this.props.setCategories(categories);

                    state.connection.webSocketConnect();
                }, (error) => {
                    state.connection.token = false;
                    this.setState({ connection: state.connection });
                    this.setState({ errorMessage: "Get port info failed [" + error.data.message + "]" });
                });
            }.bind(this),

            function (error) {
                state.connection.token = false;
                this.setState({ connection: state.connection });
                console.log(error);
                this.setState({ errorMessage: "Login failed [" + error.data.message + "]" });
            }.bind(this)
        );

    }

    hostChanged(evt) {
        let connection = this.state.connection;
        connection.host = evt.target.value;
        this.setState(
            { connection: connection }
        );
    }

    portChanged(evt) {
        let connection = this.state.connection;
        connection.port = evt.target.value;
        this.setState(
            { connection: connection }
        );
    }

    usernameChanged(evt) {
        let connection = this.state.connection;
        connection.username = evt.target.value;
        this.setState(
            { connection: connection }
        );
    }

    passwordChanged(evt) {
        let connection = this.state.connection;
        connection.password = evt.target.value;
        this.setState(
            { connection: connection }
        );
    }

    render() {

        let state;
        if (this.state.connection.isConnected)
            state = <><div className="active"></div> Connected</>
        else
            state = <><div className="inactive"></div> Disconnected</>

        let login;
        if (this.state.connection.token)
            login = <><div className="active"></div> Login Okay</>
        else
            login = <><div className="inactive"></div> Can not login</>

        return (
            <div>
                <table width="100%">
                    <tbody>
                        <tr>
                            <td align="center">
                                <h3>State</h3>
                                {state}
                            </td>
                            <td align="center">
                                <h3>Login</h3>
                                {login}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h3>Host/IP</h3>
                <input type="text" value={this.state.connection.host} onChange={this.hostChanged} />
                <h3>{this.state.connection.https} Port</h3>
                <input type="text" value={this.state.connection.port} onChange={this.portChanged} />
                <h3>Username</h3>
                <input type="text" value={this.state.connection.username} onChange={this.usernameChanged} />
                <h3>Password</h3>
                <input type="password" value={this.state.connection.password} onChange={this.passwordChanged} />
                {this.state.errorMessage}
                <button className="button" onClick={this.connect}>connect</button>
            </div>
        );
    }
}

export default Connection;
