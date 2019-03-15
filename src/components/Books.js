import React from "react";
import firebase from "../Firestore";
import { Container, Image, Row, Col, ListGroup, ListGroupItem, ModalTitle } from "react-bootstrap";

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerGithub = new firebase.auth.GithubAuthProvider();

export class BookItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.book.title,
            description: props.book.description,
            author: props.book.author,
            likes: props.book.usersLiked.length,
            comments: 0, // TODO
            owner: props.book.owner,
            currentHolder: props.book.currentHolder,
            uid: props.book.uid,
        };
    }

    render() {
        return (
            <Row>
                <Col sm={{ size: 2, order: 2, offset: 1 }}>
                    <p>{this.props.index}</p>
                </Col>
                <Col sm={{ size: 2, order: 2, offset: 1 }}>
                    <p>{this.state.title}</p>
                </Col>
                <Col sm={{ size: 2, order: 2, offset: 1 }}>
                    <p>{this.state.author}</p>
                </Col>
            </Row>
        );
    }
}

class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            books: [],
        };
    }

    async loadBooks() {
        const db = firebase.firestore();
        return db.collection('books').where('owner', '==', this.state.user.uid).get()
        .then(snapshot => {
            var books = [];
            snapshot.forEach(doc => {
                var book = doc.data();
                book.uid = doc.id;
                books.push(book);
            });

            this.setState({
                books: books,
            })
        })
        .catch(err => {
            console.log('Error getting document from books collection', err);

            this.setState({
                books: [],
            })
        });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user,
                });
                this.loadBooks();
            } else {
                this.setState({
                    user: null,
                    books: [],
                });
            }
        });
    }
    render() {

        const { user } = this.state;
        var { books } = this.state;
        
        console.log('Here are the books:', books);
        
        return (
            <React.Fragment>
                <Container>
                    <div><h2>My books</h2></div>
                    <ListGroup>
                        {books.map((book, index) => { 
                            return (
                                <ListGroupItem key={book.uid}>
                                    <BookItem book={book} index={index + 1} />
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                    {user && books.length === 0 && <h5>You have no books.</h5>}
                    {!user && <h5>Please, log in.</h5>}
                </Container>
            </React.Fragment>
        );
    }
}

export default BookList;
