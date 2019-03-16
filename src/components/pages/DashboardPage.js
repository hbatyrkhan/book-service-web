import React from "react";
import { MDBRow, MDBTable } from "mdbreact";
import AdminCardSection1 from "./sections/AdminCardSection1";
import AdminCardSection2 from "./sections/AdminCardSection2";
import TableSection from "./sections/TableSection";
import BreadcrumSection from "./sections/BreadcrumSection";
import ChartSection1 from "./sections/ChartSection1";
import ChartSection2 from "./sections/ChartSection2";
import MapSection from "./sections/MapSection";
import ModalSection from "./sections/ModalSection";
import BookList from "./sections/BookList";

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryInput: ""
    };
  }
  handlerInput = value => {
    this.setState({
      queryInput: value
    });
  };
  render() {
    return (
      <React.Fragment>
        <BreadcrumSection handler={this.handlerInput} />
        {false && <AdminCardSection1 />}
        {false && <ChartSection1 />}
        <MDBTable striped>
          <BookList allBooks queryInput={this.state.queryInput} />
        </MDBTable>
        <TableSection />
        <ChartSection2 />
        <MDBRow className="mb-4">
          <MapSection />
          <ModalSection />
        </MDBRow>
        <AdminCardSection2 />
      </React.Fragment>
    );
  }
}

export default DashboardPage;
