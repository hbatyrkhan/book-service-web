import React from 'react';
import firebase from "../Firestore";
import googleLogo from './logos/google.jpg';
import githubLogo from './logos/github.png';
import {Container, Image, Row, Col} from 'react-bootstrap'

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerGithub = new firebase.auth.GithubAuthProvider();

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            email: '',
            fullname: '',
        };
    }
    componentDidMount() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('This is the user: ', user);
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
        this.setState({
          [e.target.name]: e.target.value
        });
    }
    addUser = e => {
        e.preventDefault();
        const db = firebase.firestore().collection('users');
        const userRef = db.where('fullname', '==', this.state.user.displayName).get().then(
            snapshot => {
                snapshot.forEach(doc => {
                  console.log(doc.id, '=>', doc.data());
                })
            }).catch(err => {
            console.log('Error getting document', err);
          });
        console.log(userRef);
        this.setState({
          fullname: '',
          email: ''
        });
    };
    signInGoogle = e => {
      firebase.auth().signInWithPopup(providerGoogle).then(function(result) {
        const user = result.user;
        console.log(user);
        console.log(user.uid);
      }).catch(function(error) {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
    }
    signInGithub = e => {
      firebase.auth().signInWithPopup(providerGithub).then(function(result) {
        const user = result.user;
        console.log(user);
        console.log(user.uid);
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
            <form onSubmit={this.addUser}>
              <input
                type="text"
                name="fullname"
                placeholder="Full name"
                onChange={this.updateInput}
                value={this.state.fullname}
              />
              <input
                type="email"
                name="email"
                placeholder="Full name"
                onChange={this.updateInput}
                value={this.state.email}
              />
              <button type="submit">Submit</button>
              
            </form>
            <Container>
              <Row>
                <Col sm={{ size: 2, order: 2, offset: 1 }}>
                  {(!user && <Image src={googleLogo} onClick={this.signInGoogle} rounded />)}
                </Col>
                <Col sm={{ size: 2, order: 2, offset: 1 }}>
                  {(!user && <Image src={githubLogo} onClick={this.signInGithub} rounded />)}
                </Col>
              </Row>
              {(user && <p>{user.displayName}</p>)}
              {(user && <button onClick={this.signOut}>Log out</button>)}
            </Container>

        </React.Fragment>
        );
      }
   }

export default User;