import React from "react";
import {
  MDBCard,
  MDBCol,
  MDBRow,
  MDBView,
  MDBMask,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBBtn,
  MDBIcon,
  toast
} from "mdbreact";
import src1 from "../../assets/img-1.jpg";
import firebase from "../../Firestore";
import BookList from "./sections/BookList";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      requests: [],
      books: [],
      modalBook: false
    };
  }
  toggleBook = () => {
    this.setState({
      modalBook: !this.state.modalBook
    });
  };
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
  readDelNotification = async id => {
    try {
      await firebase
        .firestore()
        .collection("notifications")
        .doc(id)
        .delete();
      console.log("Changed!!!");
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    const photoURL = this.state.user ? this.state.user.photoURL : src1;
    return this.state.user ? (
      <React.Fragment>
        <MDBRow className="justify-content-center">
          <MDBCol sm="12" md="6" lg="3" className="mb-5">
            <MDBCard>
              <MDBCardImage className="img-fluid" src={photoURL} />
              <MDBCardBody>
                <MDBCardTitle className="text-center mb-2 font-bold">
                  {this.state.user.fullname}
                </MDBCardTitle>
                <MDBCardTitle
                  sub
                  className="text-center indigo-text mb-2 font-bold"
                >
                  {this.state.user.email}
                </MDBCardTitle>
                <MDBCardText>
                  <strong className="mb-2">About:</strong>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Ratione perferendis quod animi dignissimos consectetur
                  quibusdam numquam laboriosam, minus, provident...
                </MDBCardText>
                <div className="row justify-content-end pr-1">
                  <MDBBtn size="sm" outline color="primary">
                    More...
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <BookList
            reqBooks
            modalBook={this.state.modalBook}
            toggleBook={this.toggleBook}
          />
        </MDBRow>
      </React.Fragment>
    ) : (
      <React.Fragment>Please Log In</React.Fragment>
    );
  }
}

export default ProfilePage;
