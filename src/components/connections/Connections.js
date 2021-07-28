import React from "react";
import Connection from "../connection/Connection.js";

class Connections extends React.Component {
    
    render() {       
        return (
            <div className="page">
                <h1>Device</h1>
                <Connection connection={this.props.connection} />
            </div>
        );
    }
}

export default Connections;
