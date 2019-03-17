import React, { Component } from "react";
import Routes from "../src/components/Routes";
import TopNavigation from "./components/topNavigation";
import SideNavigation from "./components/sideNavigation";
import Footer from "./components/Footer";
import "./index.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscription: null,
      user: null
    };
  }
  render() {
    return (
      <div className="flexible-content">
        <TopNavigation />
        {false && <SideNavigation />}
        <main className="p-5">
          <Routes />
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
