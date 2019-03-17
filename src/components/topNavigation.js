import React, { Component } from "react";
import {
  ToastContainer,
  toast,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavLink,
  MDBIcon,
  MDBBtn
} from "mdbreact";
import firebase from "../Firestore";
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerGithub = new firebase.auth.GithubAuthProvider();

class TopNavigation extends Component {
  state = {
    collapse: false,
    user: null,
    subscription: null
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
                  user: data.data(),
                  subscription: firebase
                    .firestore()
                    .collection("notifications")
                    .onSnapshot(function(snapshot) {
                      console.log("triggered...", snapshot.docChanges());

                      snapshot.docChanges().forEach(doc => {
                        // console.log("Current data: ", doc.type, doc.doc.data());
                        // console.log(doc.doc.data().toUser, data.data().uid);
                        // console.log(doc.doc.data().isRead);
                        if (doc.type === "added") {
                          if (
                            doc.doc.data().toUser === data.data().uid &&
                            doc.doc.data().isRead === false
                          ) {
                            toast.info(
                              doc.doc.data().fromUser +
                                ": " +
                                doc.doc.data().message,
                              {
                                autoClose: false
                              }
                            );
                            console.log("Should have seen this notify action");
                            self.readDelNotification(doc.doc.id);
                          }
                        }
                      });
                    })
                },
                () => {}
              );
            });
          })
          .catch(err => {
            console.log("Error user from users collection", err);
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
  componentWillUnmount() {
    console.log("Unmounting...");
    if (this.state.subscription) {
      this.state.subscription();
    }
    this.setState({
      subscription: null
    });
  }
  readDelNotification = id => {
    firebase
      .firestore()
      .collection("notifications")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Changed!!!");
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  onClick = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };
  signInGoogle = e => {
    const self = this;
    firebase
      .auth()
      .signInWithPopup(providerGoogle)
      .then(function(result) {
        const user = result.user;
        console.log(user.photoURL);
        //   console.log(user.uid);
        self.addUser(user);
        toast.success("Successfully logged in", { position: "top-right" });
      })
      .catch(function(error) {
        toast.error(error.message, { autoClose: 3000 });
      });
  };
  signInGithub = e => {
    const self = this;
    firebase
      .auth()
      .signInWithPopup(providerGithub)
      .then(function(result) {
        const user = result.user;
        // console.log(user);
        //   console.log(user.uid);
        self.addUser(user);
        toast.success("Successfully logged in", { position: "top-right" });
      })
      .catch(function(error) {
        const errorMessage = error.message;
        toast.error(errorMessage, { autoClose: 3000 });
      });
  };
  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };
  signOut = e => {
    const self = this;
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        self.setState(
          {
            user: null
          },
          () => {
            toast.success("Logged out", { position: "top-right" });
          }
        );
      })
      .catch(function(error) {
        // An error happened.
        toast.error(error.message, { autoClose: 4000 });
      });
  };
  addUser = user => {
    console.log("Here ", user.photoURL);
    const db = firebase.firestore();
    db.collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then(snapshot => {
        let ok = 1;
        snapshot.forEach(doc => {
          console.log(doc.id, "=>", doc.data());
          ok = 0;
          // break;
        });
        if (ok === 1) {
          db.collection("users")
            .add({
              fullname: String(user.displayName),
              email: String(user.email),
              uid: String(user.uid),
              photoUrl: String(user.photoURL)
            })
            .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  };
  render() {
    return (
      <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
        <ToastContainer
          hideProgressBar={true}
          newestOnTop={true}
          autoClose={5000}
        />
        <MDBNavbarToggler onClick={this.onClick} />
        <MDBCollapse isOpen={this.state.collapse} navbar>
          <MDBNavbarNav left>
            <MDBNavItem active>
              <MDBNavLink to="/">Home</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/profile">Profile</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/books">Books</MDBNavLink>
            </MDBNavItem>
            {false && (
              <MDBNavItem>
                <MDBNavLink to="/maps">Maps</MDBNavLink>
              </MDBNavItem>
            )}
            {false && (
              <MDBNavItem>
                <MDBNavLink to="/404">404 Page</MDBNavLink>
              </MDBNavItem>
            )}
          </MDBNavbarNav>
          <MDBNavbarNav right>
            {!this.state.user && (
              <MDBNavItem>
                <a
                  className="nav-link navbar-link"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://pl-pl.facebook.com/mdbootstrap/"
                >
                  <MDBIcon fab icon="facebook" />
                </a>
              </MDBNavItem>
            )}
            {!this.state.user && (
              <MDBNavItem onClick={this.signInGoogle}>
                <span className="nav-link navbar-link">
                  <MDBIcon fab icon="google" />
                </span>
              </MDBNavItem>
            )}
            {!this.state.user && (
              <MDBNavItem onClick={this.signInGithub}>
                <span className="nav-link navbar-link">
                  <MDBIcon fab icon="github" />
                </span>
              </MDBNavItem>
            )}
            {!this.state.user && (
              <MDBNavItem>
                <span
                  className="nav-link navbar-link"
                  rel="noopener noreferrer"
                >
                  <MDBIcon fab icon="twitter" />
                </span>
              </MDBNavItem>
            )}
            {this.state.user && (
              <MDBNavItem>
                <span className="nav-link navbar-link">
                  Hello, {this.state.user.fullname}
                </span>
              </MDBNavItem>
            )}
            {this.state.user && (
              <MDBBtn
                rounded
                color="danger"
                size="sm"
                className="border border-light rounded mr-1 nav-link Ripple-parent"
                onClick={this.signOut}
              >
                logout
              </MDBBtn>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

export default TopNavigation;
