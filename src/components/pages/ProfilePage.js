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
          <MDBCol md="6" lg="9">
            <section className="text-center pb-3">
              <MDBRow className="d-flex justify-content-center">
                <MDBCol lg="6" xl="5" className="mb-3">
                  <MDBCard className="d-flex mb-5">
                    <MDBView>
                      <img
                        src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-profile-page.jpg"
                        alt="Project"
                        className="img-fluid"
                      />
                      <MDBMask overlay="white-slight" />
                    </MDBView>
                    <MDBCardBody>
                      <MDBCardTitle className="font-bold mb-3">
                        <strong>Project name</strong>
                      </MDBCardTitle>
                      <MDBCardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter className="links-light profile-card-footer">
                      <span className="right">
                        <a className="p-2" href="#profile">
                          Live Preview
                          <MDBIcon icon="image" className="ml-1" />
                        </a>
                      </span>
                    </MDBCardFooter>
                  </MDBCard>
                </MDBCol>
                <MDBCol lg="6" xl="5" className="mb-3">
                  <MDBCard className="d-flex mb-5">
                    <view-wrapper>
                      <img
                        src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-signup.jpg"
                        alt="Project"
                        className="img-fluid"
                      />
                      <MDBMask overlay="white-slight" />
                    </view-wrapper>
                    <MDBCardBody>
                      <MDBCardTitle className="font-bold mb-3">
                        <strong>Project name</strong>
                      </MDBCardTitle>
                      <MDBCardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter className="links-light profile-card-footer">
                      <span className="right">
                        <a className="p-2" href="#profile">
                          Live Preview
                          <MDBIcon icon="image" className="ml-1" />
                        </a>
                      </span>
                    </MDBCardFooter>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </section>
          </MDBCol>
        </MDBRow>
      </React.Fragment>
    ) : (
      <React.Fragment>Please Log In</React.Fragment>
    );
  }
}

export default ProfilePage;
