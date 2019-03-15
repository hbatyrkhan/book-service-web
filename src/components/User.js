import React from 'react';
import firebase from "../Firestore";
import googleLogo from './logos/google.jpg';
import githubLogo from './logos/github.png';
import {Container, Image, Row, Col, Pagination} from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerGithub = new firebase.auth.GithubAuthProvider();

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }
    componentDidMount() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // console.log('This is the user: ', user);
            this.setState({
              user: user,
            });
        } else {
            // No user is signed in.
            this.setState({
              user: null,
            })
            console.log('There is no logged in user');
        }
      });
    }
    updateInput = e  => {
        /*this.setState({
          [e.target.name]: e.target.value
        });*/
    }
    addUser = () => {
        const db = firebase.firestore();
        const userRef = db.collection('users').where('uid', '==', this.state.user.uid).get().then(
            snapshot => {
                let ok = 1;
                snapshot.forEach(doc => {
                  console.log(doc.id, '=>', doc.data());
                  ok = 0;
                  // break;
                })
                if(ok === 1) {
                  db.collection('users').add({
                    fullname: String(this.state.user.displayName),
                    email: String(this.state.user.email),
                    uid: String(this.state.user.uid),
                  }).then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                  }).catch(function(error) {
                    console.error("Error adding document: ", error);
                  });
                }
            }).catch(err => {
            console.log('Error getting document', err);
          });
          // console.log(userRef);
        /*this.setState({
          fullname: '',
          email: ''
        });*/
    };
    signInGoogle = e => {
      firebase.auth().signInWithPopup(providerGoogle).then(function(result) {
        const user = result.user;
        // console.log(user);
        console.log(user.uid);
        this.addUser();
      }).catch(function(error) {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
    }
    signInGithub = e => {
      firebase.auth().signInWithPopup(providerGithub).then(function(result) {
        const user = result.user;
        // console.log(user);
        console.log(user.uid);
        this.addUser();
      }).catch(function(error) {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
    }
    signOut = e => {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        this.setState({
          user: null,
        });
      }).catch(function(error) {
        // An error happened.
      });
    }
    render() {
        const { user } = this.state;
        return (
          <React.Fragment>
            <Container>
              {(!user && <Pagination>
                <Pagination.Item onClick={this.signInGoogle}><SocialIcon network="google" /></Pagination.Item>
                <Pagination.Item onClick={this.signInGithub}><SocialIcon network="github" /></Pagination.Item>
              </Pagination>)}
              {(user && <p>{user.displayName}</p>)}
              {(user && <button onClick={this.signOut}>Log out</button>)}
            </Container>

        </React.Fragment>
        );
      }
   }

export default User;