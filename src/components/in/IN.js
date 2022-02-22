import React from "react";

class IN extends React.Component {

    state = {};

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        this.setState({ element: this.props.element });
    }

    onClick() {
        let value;

        if (parseFloat(this.props.element.outputs[0].value))
            value = 0;
        else
            value = 1;

        this.props.element.outputs[0].updatePort("OUT", this.props.element.ID, 0, value);
    };


    render() {
        let active;
        if (parseFloat(this.props.element.outputs[0].value)) {
            active = "activeClickable"
        }
        else {
            active = "inactiveClickable"
        }

        return (
            <div className="in" onClick={this.onClick}>
                <div className="name">
                    <b>{this.props.element.vars.NAME}</b><br />
                    <small>{this.props.element.vars.CATEGORIE} | {this.props.element.vars.ROOM}</small>
                </div>
                <div className="value"><div className={active}></div></div>
            </div>
        );
    }
}

export default IN;
