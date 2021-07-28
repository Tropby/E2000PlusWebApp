import React from "react";
import { Line } from 'react-chartjs-2';

class LoggerR extends React.Component {

    state = {
        update: true,
        data: {
            labels: [],
            datasets: [
                {
                    label: '#1',
                    data: [],
                    fill: false,
                    borderColor: "#FF0000",
                    pointRadius: 0
                },
                {
                    label: '#2',
                    data: [],
                    fill: false,
                    borderColor: "#00FF00",
                    pointRadius: 0
                },
                {
                    label: '#3',
                    data: [],
                    fill: false,
                    borderColor: "#0000FF",
                    pointRadius: 0
                },
                {
                    label: '#4',
                    data: [],
                    fill: false,
                    borderColor: "#CC00CC",
                    pointRadius: 0
                },
                {
                    label: '#5',
                    data: [],
                    fill: false,
                    borderColor: "#CCCC00",
                    pointRadius: 0
                },
                {
                    label: '#6',
                    data: [],
                    fill: false,
                    borderColor: "#00CCCC",
                    pointRadius: 0
                },
                {
                    label: '#7',
                    data: [],
                    fill: false,
                    borderColor: "#AABBCC",
                    pointRadius: 0
                },
                {
                    label: '#8',
                    data: [],
                    fill: false,
                    borderColor: "#DEDEDE",
                    pointRadius: 0
                }
            ]
        },
        options: {
            maintainAspectRatio: true,
            aspectRatio: (window.innerWidth > window.innerHeight ? window.innerWidth / (window.innerHeight - 200) : window.innerWidth / (window.innerHeight - 80)),
            animation: false,
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0
        }
    }

    end = new Date();
    start = new Date();

    constructor() {
        super();
        this.updateData = this.updateData.bind(this);
    }

    shouldComponentUpdate() {
        if (this.end !== this.props.end)
        {
            this.updateData();
        }
        
        else if (this.start !== this.props.start)
        {
            this.updateData();            
        }

        let u = this.state.update;
        if (u)
        {         
            this.setState({ update: false });
        }
        return u;
    }

    getChartData = canvas => {
        const { data } = this.state;
        return data;
    }

    updateData() {
        this.end = this.props.end;
        this.start = this.props.start;

        this.setState((state) => {
            state.data.labels = [];
            return state;
        });

        let id = this.props.logger.id;
        this.props.logger.getData(id, this.props.start, this.props.end).then((data) => {
            this.setState((state) => {
                state.data.labels = [];
                for (let i = 0; i < 8; i++)
                {
                    state.data.datasets[i].label = data.header[i];                    
                    state.data.datasets[i].hidden = (data.header[i] === "")
                    state.data.datasets[i].data = [];
                }

                data.values.forEach(element => {
                    state.data.labels.push(new Date(element.dateTime).toLocaleDateString("de-DE") + " " + new Date(element.dateTime).toLocaleTimeString("de-DE"));
                    for (let i = 0; i < 8; i++) {
                        state.data.datasets[i].data.push(element.values[i]);
                    }
                });
                
                state.update = true;
                return state;
            });
        });
    }

    render() {
        return (
            <div style={{ overflow: "hidden" }}>
                <h2>{this.props.logger.name}</h2>
                <Line data={this.getChartData} options={this.state.options} />
                <button onClick={this.updateData}>Update</button>
            </div>
        );
    }
}

export default LoggerR;
