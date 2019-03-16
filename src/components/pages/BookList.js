import React from "react";
import firebase from "../../Firestore";
import { MDBTableBody } from "mdbreact";

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
      uid: props.book.uid
    };
  }

  render() {
    return (
      <tr>
        <td>{this.props.index}</td>
        <td>{this.state.title}</td>
        <td>{this.state.author}</td>
        <td>{this.state.description}</td>
      </tr>
    );
  }
}

class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      books: []
    };
  }

  async loadBooks() {
    const db = firebase.firestore();
    return db
      .collection("books")
      .where(String(this.props.userType), "==", String(this.state.user.uid))
      .get()
      .then(snapshot => {
        let books = [];
        snapshot.forEach(doc => {
          let book = doc.data();
          book.uid = doc.id;
          books.push(book);
        });

        this.setState({
          books: books
        });
      })
      .catch(err => {
        console.log("Error getting document from books collection", err);

        this.setState({
          books: []
        });
      });
  }
  async loadMarkedBooks() {
    const db = firebase.firestore();
    this.state.user.markedBooks.forEach(bookId => {
      db.collection("books")
        .doc(String(bookId))
        .get()
        .then(loadBook => {
          let book = loadBook.data();
          //   console.log("Book ", book);
          book.uid = bookId;
          this.setState({
            books: [...this.state.books, book]
          });
        })
        .catch(err => {
          console.log("Error getting document from books collection", err);

          this.setState({
            books: []
          });
        });
    });
  }

  componentDidMount() {
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
                () => {
                  if (this.props.markedBooks) {
                    this.loadMarkedBooks();
                  } else {
                    this.loadBooks();
                  }
                }
              );
            });
          })
          .catch(err => {
            // console.log("Error user from users collection", err);
            this.setState({
              user: null,
              books: []
            });
          });
      } else {
        this.setState({
          user: null,
          books: []
        });
      }
    });
  }
  render() {
    const { user } = this.state;
    const { books } = this.state;

    // console.log(user);
    return (
      <React.Fragment>
        <MDBTableBody>
          {books.map((book, index) => {
            return <BookItem book={book} index={index + 1} key={book.uid} />;
          })}
        </MDBTableBody>
        {user && books.length === 0 && (
          <MDBTableBody>
            <tr>
              <td>You have no books.</td>
            </tr>
          </MDBTableBody>
        )}
        {!user && (
          <MDBTableBody>
            <tr>
              <td>Please, log in.</td>
            </tr>
          </MDBTableBody>
        )}
      </React.Fragment>
    );
  }
}

export default BookList;
