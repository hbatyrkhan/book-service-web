import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBFormInline,
  MDBBtn
} from "mdbreact";

class BreadcrumSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryInput: ""
    };
  }
  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    // console.log(this.props.handler);
    this.props.handler(e.target.value);
  };
  render() {
    return (
      <MDBCard className="mb-5">
        <MDBCardBody
          id="breadcrumb"
          className="d-flex align-items-center justify-content-between"
        >
          <MDBBreadcrumb>
            <MDBBreadcrumbItem>Home</MDBBreadcrumbItem>
            <MDBBreadcrumbItem active>All Books</MDBBreadcrumbItem>
          </MDBBreadcrumb>
          <MDBFormInline className="md-form m-0">
            <input
              className="form-control form-control-sm"
              type="search"
              placeholder="Type your query"
              aria-label="Search"
              name="queryInput"
              onChange={this.handleInput}
              value={this.state.queryInput}
            />
            <MDBBtn size="sm" color="primary" className="my-0">
              <MDBIcon icon="search" />
            </MDBBtn>
          </MDBFormInline>
        </MDBCardBody>
      </MDBCard>
    );
  }
}

export default BreadcrumSection;
