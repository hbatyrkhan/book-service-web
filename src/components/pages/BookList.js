import React from "react";
import firebase from "../../Firestore";
import {MDBTableBody} from 'mdbreact';

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
            <tr>
                <td>
                    {this.props.index}
                </td>
                <td>
                    {this.state.title}
                </td>
                <td>
                    {this.state.author}
                </td>
                <td>
                    {this.state.description}
                </td>
            </tr>
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
        return db.collection('books').where('currentHolder', '==', String(this.state.user.uid)).get()
        .then(snapshot => {
            let books = [];
            snapshot.forEach(doc => {
                let book = doc.data();
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
        const { books } = this.state;
        
        console.log('Here are the books:', books);
        return (
            <React.Fragment>
                    <MDBTableBody>
                        {books.map((book, index) => { 
                            return (
                                <BookItem book={book} index={index + 1} key={book.uid}/>
                            );
                        })}
                    </MDBTableBody>
                    {user && books.length === 0 && <MDBTableBody><tr><td>You have no books.</td></tr></MDBTableBody>}
                    {!user && <MDBTableBody><tr><td>Please, log in.</td></tr></MDBTableBody>}
            </React.Fragment>
        );
    }
}

export default BookList;
