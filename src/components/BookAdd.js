import React from "react";
import firebase from "../Firestore";
import { Form } from "react-bootstrap";

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerGithub = new firebase.auth.GithubAuthProvider();

class BookAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
        };
    }

    async addBook() {
        this.setState({
            isLoading: true,
        })

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
            } else {
                this.setState({
                    user: null,
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <Form>
                    <Form.Group controlId="bookForm.title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="e.g. White Fang" />
                    </Form.Group>

                    <Form.Group controlId="bookForm.author">
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" placeholder="e.g. Jack London" />
                    </Form.Group>

                    <Form.Group controlId="bookForm.publisher">
                        <Form.Label>Publisher</Form.Label>
                        <Form.Control type="text" placeholder="e.g. Pearson" />
                    </Form.Group>

                    <Form.Group controlId="bookForm.description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3" />
                    </Form.Group>

                    <Button 
                        variant="primary"
                        disabled={isLoading}
                        onClick={isLoading ? null : this.addBook}
                    >
                        Add
                    </Button>
                </Form>
            </React.Fragment>
        );
    }
}

export default BookAdd;
