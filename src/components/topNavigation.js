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
    user: null
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //   console.log('This is the user: ', user);
        this.setState({
          user: user
        });
      } else {
        // No user is signed in.
        this.setState({
          user: null
        });
        //   console.log('There is no logged in user');
      }
    });
  }
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
        // console.log(user);
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
              uid: String(user.uid)
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
        <MDBNavbarBrand href="/">
          <strong>MDB</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.onClick} />
        <MDBCollapse isOpen={this.state.collapse} navbar>
          <MDBNavbarNav left>
            <MDBNavItem active>
              <MDBNavLink to="#">Home</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <a
                rel="noopener noreferrer"
                className="nav-link Ripple-parent"
                href="https://mdbootstrap.com/docs/react/"
                target="_blank"
              >
                About MDB
              </a>
            </MDBNavItem>
            <MDBNavItem>
              <a
                rel="noopener noreferrer"
                className="nav-link Ripple-parent"
                href="https://mdbootstrap.com/docs/react/getting-started/download/"
                target="_blank"
              >
                Free download
              </a>
            </MDBNavItem>
            <MDBNavItem>
              <a
                rel="noopener noreferrer"
                className="nav-link Ripple-parent"
                href="https://mdbootstrap.com/bootstrap-tutorial/"
                target="_blank"
              >
                Free tutorials
              </a>
            </MDBNavItem>
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
                  Hello, {this.state.user.displayName}
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
