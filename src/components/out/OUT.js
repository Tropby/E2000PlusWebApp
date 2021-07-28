import React from "react";

class OUT extends React.Component {

    render() {

        let active;

        switch (this.props.element.vars.TYPE)
        {
            case "0":
                if (parseFloat(this.props.element.inputs[0].value)) {
                    active = <div className="active"></div>
                }
                else {
                    active = <div className="inactive"></div>
                }
                break;
            
            case "1":
                active = <div>{this.props.element.inputs[0].value} {this.props.element.vars.SUFFIX}</div>
                break;
            
            default:
                break;
        }

        return (
            <div className="out">
                <div className="name">
                    {this.props.element.vars.NAME}<br />
                    <small>{this.props.element.vars.CATEGORIE} | {this.props.element.vars.ROOM}</small>
                </div>
                <div className="value">{active}</div>
            </div>
        );
    }
}

export default OUT;
