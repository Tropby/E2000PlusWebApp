class E2000API {

    host = undefined;
    port = undefined;
    token = undefined;
    username = "admin";
    password = "12345";

    webSocketLoggedIn = false;
    isConnected = false;

    lastMessage = null;
    lastTokenUpdate = null;

    wss = (window.location.protocol !== "https:" ? "ws" : "wss");
    https = (window.location.protocol !== "https:" ? "http" : "https");

    onWebsocketLoggedIn = function () { console.debug("Please overwrite onWebsocketLoggedIn!"); };
    onPortChanged = function (data) { console.debug("Please overwrite onPortChanged!", data); };
    onInfoReceived = function (data) { console.debug("Please overwrite onInfoReceived!", data); };

    /**
     * @var ws Websocket
     */
    ws = undefined;

    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    webSocketSend(msg) {
        if (this.ws === null || typeof (this.ws) === "undefined") return;

        let json = JSON.stringify(msg);
        console.log(this, json);
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(json);
        }
    }

    webSocketLogin() {
        let msg = {
            command: "L",
            data: {
                token: this.token
            }
        }
        this.webSocketSend(msg);
    }

    webSocketPing() {
        let msg = {
            command: "N",
            data: {}
        };
        this.webSocketSend(msg);
    }

    info() {
        let msg = {
            command: "I",
            data: {}
        };
        this.webSocketSend(msg);
    }

    setPort(type, id, port, value) {
        let msg = {
            command: "P",
            data: {
                name: type + "." + id + "." + port,
                value: value + ""
            }
        };
        this.webSocketSend(msg);
    }

    webSocketConnect() {
        if (typeof this.ws !== "undefined")
        {
            if (this.ws !== null) {
                console.log("Try to close connection!");
                this.ws.onclose = e => {
                    console.log("Old Connection closed!");
                };
                this.ws.close();
                this.ws = null;
            }
        }

        this.ws = new WebSocket(this.wss + "://" + this.host + ":" + this.port + "/msg", "e2000");

        this.ws.onopen = function () {
            console.log("Websocket connected!");
            this.webSocketLogin();
        }.bind(this);

        this.ws.onclose = function (e) {
            console.log(
                `Socket is closed.`,
                e
            );

            this.ws = null;

            setTimeout(
                function () {
                    this.webSocketConnect();
                }.bind(this),
                1000
            );
        }.bind(this);

        // websocket onerror event listener
        this.ws.onerror = function (err) {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            this.ws.close();
        }.bind(this);

        this.ws.onmessage = function (evt) {
            try {
                let json = JSON.parse(evt.data);

                switch (json.command) {
                    case "N":
                        this.webSocketPing();
                        break;

                    case "L":
                        if (json.data.result === "OK") {
                            this.webSocketLoggedIn = true;
                            this.onWebsocketLoggedIn();
                        }
                        break;

                    case "P":
                        this.onPortChanged(json.data);
                        break;

                    case "I":
                        this.onInfoReceived(json.data);
                        break;

                    default:
                        console.warn("unknwon command received from e2000 mcu!", json);
                        break;
                }
            }
            catch (e) {
                console.error(e);
            }

        }.bind(this);
    };

    logicBlock(blockId) {
        return new Promise((resolve, reject) => {
            fetch(this.https + "://" + this.host + ":" + this.port + "/api/" + this.token + "/logicBlock/" + blockId)
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.code === "okay") {
                            resolve(result.data);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        });
    }

    logger() {
        return new Promise((resolve, reject) => {
            fetch(this.https + "://" + this.host + ":" + this.port + "/api/" + this.token + "/logger")
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.code === "okay") {
                            resolve(result.data);
                        }
                        else
                            reject(result);
                    },
                    (error) => {
                        reject(error);
                    }
                )
        });
    }

    loggerData(name, startDate, endDate) {
        startDate = Math.floor(startDate.getTime() / 1000.0);
        endDate = Math.floor(endDate.getTime() / 1000.0);
        return new Promise((resolve, reject) => {
            fetch(this.https + "://" + this.host + ":" + this.port + "/api/" + this.token + "/logger/" + name + "/" + startDate + "/" + endDate)
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.code === "okay") {
                            resolve(result.data);
                        }
                        else {
                            reject(result.code);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        });
    }

    refreshToken() {
        return new Promise((resolve, reject) => {
            fetch(this.https + "://" + this.host + ":" + this.port + "/api/" + this.token + "/refreshToken")
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.code === "okay") {                            
                            resolve(result.data);
                        }
                        else
                        {
                            console.log("update token failed", result);
                            this.isConnected = false;
                            reject(result);
                        }
                    },
                    (error) => {
                        this.isConnected = false;
                        reject(error);
                    }
                )
        });
    };

    login() {
        return new Promise((resolve, reject) => {
            timeout(500, fetch(this.https + "://" + this.host + ":" + this.port + "/api/login/" + this.username + "/" + this.password))
                .then(res => res.json())
                .then(
                    (result) => {
                        this.isConnected = true;
                        if (result.code === "okay") {
                            this.token = result.data.apiToken;
                            resolve();
                        }
                        else {
                            reject();
                        }
                    },
                    (error) => {
                        this.isConnected = false;
                        reject();
                    }
                )
        });
    };

    startPortTransfer() {
        if (this.webSocketLoggedIn) {
            let msg = {
                command: "S",
                data: {}
            }
            this.webSocketSend(msg);
            return true;
        }
        else {
            return false;
        }
    }

    portData() {
        return new Promise((resolve, reject) => {
            fetch(this.https + "://" + this.host + ":" + this.port + "/api/" + this.token + "/ports")
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.code === "okay") {
                            resolve(result.data);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
        });
    }

    debugData(enable) {
        if (this.webSocketLoggedIn) {
            let msg = {
                command: "C",
                data: {
                    config: (enable ? "Debug" : "debug"),
                    configData: ""
                }
            }
            this.webSocketSend(msg);
            return true;
        }
        else {
            return false;
        }
    }

    busData(enable) {
        if (this.webSocketLoggedIn) {
            let msg = {
                command: "C",
                data: {
                    config: (enable ? "Bus" : "bus"),
                    configData: ""
                }
            }
            this.webSocketSend(msg);
            return true;
        }
        else {
            return false;
        }
    }
};

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
}

export default E2000API;