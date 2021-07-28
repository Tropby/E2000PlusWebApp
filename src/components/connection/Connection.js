import React from "react";

class Connection extends React.Component {
    render() {
        
        let state;
        if (this.props.connection.isConnected)
            state = <div className="active"></div>
        else
            state = <div className="inactive"></div>

        return (
            <div>
                <h3>State</h3>
                {state}
                <h3>Host/IP</h3>
                <input type="text" value={this.props.connection.host} />
                <h3>Port</h3>
                <input type="text" value={this.props.connection.port} />
                <h3>Username</h3>
                <input type="text" value={this.props.connection.username} />
                <h3>Password</h3>
                <input type="text" value={this.props.connection.password} />
            </div>
        );
    }
}

export default Connection;
