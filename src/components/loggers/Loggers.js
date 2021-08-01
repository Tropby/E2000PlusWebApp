import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import DateTimePicker from 'react-datetime-picker';

import Logger from "../logger/Logger";

class Loggers extends React.Component {

    state = {
        start: new Date(new Date() - 1000 * 60 * 60),
        end: new Date()
    }

    constructor() {
        super();

        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
    }

    onChangeStart(e) {
        this.setState({ start: e });
    }

    onChangeEnd(e) {
        this.setState({ end: e });
    }

    render() {
        return (
            <div className="page">
                <h1>Loggers</h1>

                <b>Start</b>
                <DateTimePicker
                    onChange={this.onChangeStart}
                    value={this.state.start}
                />
                <b>End</b>
                <DateTimePicker
                    onChange={this.onChangeEnd}
                    value={this.state.end}
                />

                <Router>
                    <Switch>
                        <Route exact path="/loggers">
                            {this.props.loggers.map((r) => <Link key={r.id} to={"/loggers/" + r.id}>{r.name}</Link>)}
                        </Route>
                        {this.props.loggers.map((r) => <Route key={r.id} exact path={"/loggers/" + r.id}><Logger start={this.state.start} end={this.state.end} logger={r} /></Route>)}
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default Loggers;
