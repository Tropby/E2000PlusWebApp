import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Logger from "../logger/Logger";

class Loggers extends React.Component {

    state = {
        startDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
        startTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
        endDate: new Date(new Date().getTime() + 1000 * 60 * 60),
        endTime: new Date(new Date().getTime() + 1000 * 60 * 60),
        start: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
        end: new Date(new Date().getTime() + 1000 * 60 * 60)
    }

    constructor() {
        super();

        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onChangeStartTime = this.onChangeStartTime.bind(this);
        this.onChangeEndTime = this.onChangeEndTime.bind(this);
    }

    onChangeStartDate(e) {
        let t = new Date(e.target.value);
        this.setState({ startDate: t });
        this.updateDateTime();
    }

    onChangeEndDate(e) {
        let t = new Date(e.target.value);
        this.setState({ endDate: t });
        this.updateDateTime();
    }

    onChangeStartTime(e)
    {
        let t = new Date("1970-01-01T" + e.target.value + ":00");
        this.setState({ startTime: t });
        this.updateDateTime();
    }

    onChangeEndTime(e) {
        let t = new Date("1970-01-01T" + e.target.value + ":00");
        this.setState({ endTime: t });
        this.updateDateTime();
    }

    updateDateTime()
    {
        let startDateValue = this.state.startDate.toISOString().split("T")[0];
        let endDateValue = this.state.endDate.toISOString().split("T")[0];
        let startTimeValue = this.state.startTime.toTimeString().substr(0, 5);
        let endTimeValue = this.state.endTime.toTimeString().substr(0, 5);

        this.setState({
            start: new Date(startDateValue + "T" + startTimeValue + ":00"),
            end: new Date(endDateValue + "T" + endTimeValue + ":00")
        });
    }

    render() {

        let startDateValue = this.state.startDate.toISOString().split("T")[0];
        let endDateValue = this.state.endDate.toISOString().split("T")[0];
        let startTimeValue = this.state.startTime.toTimeString().substr(0, 5);
        let endTimeValue = this.state.endTime.toTimeString().substr(0, 5);

        return (
            <div className="page">
                <h1>Loggers</h1>

                <b>Start</b>
                <div className="dateTime">
                    <input type="date" value={startDateValue} onChange={this.onChangeStartDate} />
                    <input type="time" value={startTimeValue} onChange={this.onChangeStartTime} />
                </div>
                <b>End</b>
                <div className="dateTime">
                    <input type="date" value={endDateValue} onChange={this.onChangeEndDate} />
                    <input type="time" value={endTimeValue} onChange={this.onChangeEndTime} />
                </div>

                <Router>
                    <Switch>
                        <Route exact path="/loggers">
                            {this.props.loggers.map((r) => <Link key={r.id} to={"/loggers/" + r.id}>{r.name}</Link>)}
                        </Route>
                        {this.props.loggers.map((r) => <Route key={r.id} exact path={"/loggers/" + r.id}>
                            <Logger start={this.state.start} end={this.state.end} logger={r} />
                        </Route>)}
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default Loggers;
