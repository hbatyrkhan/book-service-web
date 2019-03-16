import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBView,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from "mdbreact";
import BookList from "./BookList";
import BookAddForm from "../BookAdd";

const TablesPage = () => {
  return (
    <>
      <MDBRow>
        <MDBCol md="12">
          <MDBCard className="mt-5">
            <MDBView className="gradient-card-header blue darken-2">
              <h4 className="h4-responsive text-white">Basic tables</h4>
            </MDBView>
            <MDBCardBody>
              <BookAddForm />
              <h3 className="mt-5 text-left">
                <strong>Currently you have these books in your account:</strong>
              </h3>
              <p />
              <MDBTable striped>
                <MDBTableHead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Description</th>
                  </tr>
                </MDBTableHead>
                <BookList userType="currentHolder" />
              </MDBTable>
              <h3 className="mt-5 text-left">
                <strong>Books owned by you:</strong>
              </h3>
              <p />
              <MDBTable striped>
                <MDBTableHead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Description</th>
                  </tr>
                </MDBTableHead>
                <BookList userType="owner" />
              </MDBTable>
              <h3 className="mt-5 text-left">
                <strong>Marked books:</strong>
              </h3>
              <p />
              <MDBTable>
                <MDBTableHead color="primary-color" textWhite>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Description</th>
                  </tr>
                </MDBTableHead>
                <BookList markedBooks />
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default TablesPage;
