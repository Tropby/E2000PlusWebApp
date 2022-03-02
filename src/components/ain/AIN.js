import React from "react";

class AIN extends React.Component {

    state = {
        style: {
            width: "50%"
        }
    };

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        this.setState({ element: this.props.element });
    }

    onClick(evt) {

        let target = evt.target;

        if (target.className === "ainSliderInner")
        {
            target = target.parentElement
        }

        let x = evt.pageX - target.offsetLeft;
        let w = parseFloat(target.clientWidth);

        let p = x / w * 100.0;

        if (p < 5)
            p = 0;
        if (p > 95)
            p = 100;

        this.props.element.outputs[0].updatePort("OUT", this.props.element.ID, 0, p);
    };


    render() {
        let active = parseFloat(this.props.element.outputs[0].value);
        if (parseFloat(this.state.style.width) !== active)
        {
            this.setState({ style: {width: active + "%"} });
        }

        return (
            <div className="ain">
                <div className="name">
                    <b>{this.props.element.vars.NAME}</b><br />
                    <small>{this.props.element.vars.CATEGORIE} | {this.props.element.vars.ROOM}</small>                
                </div>
                <div className="ainSlider" onClick={this.onClick}>
                    <div className="ainSliderInner" style={this.state.style}></div>
                </div>
            </div>
        );
    }
}

export default AIN;
