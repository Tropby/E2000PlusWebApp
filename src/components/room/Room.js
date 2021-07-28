import React from "react";

import IN from "../in/IN"
import OUT from "../out/OUT"

class Room extends React.Component {

    render() {

        let portList = [];

        this.props.ports.forEach(element => {

            // Show a virtual output
            switch (element.TYPE)
            {
                case "OUT":
                    portList.push(<OUT element={element} />);
                    break;
                
                case "DEBUGIN":
                    portList.push(<IN element={element} />);
                    break;
                
                default:                    
                    break;
            }
        });

        return (
            <div>
                <h2>{this.props.name}</h2>
                <div>
                    {portList.map((e, i) => <div key={"port_" + i}>{e}</div >)}
                </div>
            </div>
        );
    }
}

export default Room;
