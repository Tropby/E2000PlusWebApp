import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Category from "../category/Category";

class Categories extends React.Component {

    render() {
        return (
            <div className="page">
                <h1>Categories</h1>
                <Router>
                    <Switch>
                        <Route exact path="/categories">
                            {this.props.categories.map((r) => <Link key={"cat_" + r.name} to={"/categories/" + r.name}>{r.name}<br /></Link>)}
                        </Route>
                        {this.props.categories.map((r) => <Route key={"cat_" + r.name} exact path={"/categories/" + r.name}><Category name={r.name} ports={r.ports} /></Route>)}
                    </Switch>
                </Router>

            </div>
        );
    }
}

export default Categories;
