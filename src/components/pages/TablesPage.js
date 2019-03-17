import React from "react";
import { MDBRow, MDBCol, MDBView, MDBCard, MDBCardBody, toast } from "mdbreact";
import BookList from "./sections/BookList";
import BookAddForm from "./sections/BookAdd";
import firebase from "./../../Firestore";

class TablesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalBook: false,
      user: null
    };
  }
  componentDidMount() {
    const self = this;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .firestore()
          .collection("users")
          .where("uid", "==", String(user.uid))
          .get()
          .then(new_user => {
            new_user.forEach(data => {
              this.setState(
                {
                  user: data.data()
                },
                () => {}
              );
            });
          })
          .catch(err => {
            // console.log("Error user from users collection", err);
            this.setState({
              user: null
            });
          });
      } else {
        this.setState({
          user: null
        });
      }
    });
  }
  componentWillUnmount() {}
  toggleBook = () => {
    this.setState({
      modalBook: !this.state.modalBook
    });
  };

  render() {
    return (
      <>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard className="mt-5">
              <MDBView className="gradient-card-header blue darken-2">
                <h4 className="h4-responsive text-white">Books page</h4>
              </MDBView>
              <MDBCardBody>
                <BookAddForm />
                <h3 className="mt-5 text-left">
                  <strong>
                    Currently you have these books in your account:
                  </strong>
                </h3>
                <p />
                <BookList
                  userType="currentHolder"
                  modalBook={this.state.modalBook}
                  toggleBook={this.toggleBook}
                />
                <h3 className="mt-5 text-left">
                  <strong>Books owned by you:</strong>
                </h3>
                <p />
                <BookList
                  userType="owner"
                  modalBook={this.state.modalBook}
                  toggleBook={this.toggleBook}
                />
                <h3 className="mt-5 text-left">
                  <strong>Marked books:</strong>
                </h3>
                <p />
                <BookList
                  markedBooks
                  modalBook={this.state.modalBook}
                  toggleBook={this.toggleBook}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </>
    );
  }
}

export default TablesPage;
