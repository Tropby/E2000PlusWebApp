import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Room from "../room/Room"

class Rooms extends React.Component {

    render() {
        return (
            <div className="page">
                <h1>Rooms</h1>
                <Router>
                    <Switch>
                        <Route exact path="/rooms">
                            {this.props.rooms.map((r) => <Link key={"room_" + r.name} to={"/rooms/" + r.name}>{r.name}</Link>)}
                        </Route>
                        {this.props.rooms.map((r) => <Route key={"room_" + r.name} exact path={"/rooms/" + r.name}><Room name={r.name} ports={r.ports} /></Route>)}
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default Rooms;
