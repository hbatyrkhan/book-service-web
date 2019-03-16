import React from "react";
import firebase from "../../../Firestore";
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
      books: [],
      queryInput: ""
    };
  }
  componentWillReceiveProps(nextProps) {
    const self = this;
    this.setState(
      {
        queryInput: nextProps.queryInput
      },
      () => {
        const tmp_books = [...this.state.books];
        tmp_books.sort(function(item1, item2) {
          return self.getRelevance(item1) < self.getRelevance(item2);
        });
        this.setState({
          books: tmp_books
        });
      }
    );
  }
  common_subs = arr1 => {
    let i = 0,
      res = 0;
    const L = arr1[0].length;
    for (const key of arr1[1].toLowerCase()) {
      if (i < L && key === arr1[0].toLowerCase().charAt(i)) {
        i++;
      } else {
        res = Math.max(i, res);
        i = 0;
      }
    }
    res = Math.max(i, res);
    if (res === L) res += res;
    return res;
  };
  getRelevance = curBook => {
    const queryInput = this.state.queryInput;
    // console.log(queryInput);
    return (
      this.common_subs([queryInput, curBook.title]) +
      this.common_subs([queryInput, curBook.author]) +
      this.common_subs([queryInput, curBook.description])
    );
  };
  loadBook = snapshot => {
    let book = snapshot.data();
    //   console.log("Book ", book);
    book.uid = snapshot.id;
    const self = this;
    const tmp_books = [...this.state.books, book];
    tmp_books.sort(function(item1, item2) {
      return self.getRelevance(item1) < self.getRelevance(item2);
    });
    this.setState({
      books: tmp_books
    });
  };
  async loadBooks() {
    const db = firebase.firestore();
    return db
      .collection("books")
      .where(String(this.props.userType), "==", String(this.state.user.uid))
      .get()
      .then(snapshot => {
        snapshot.forEach(this.loadBook);
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
    if ("markedBooks" in this.state.user) {
      this.state.user.markedBooks.forEach(bookId => {
        db.collection("books")
          .doc(String(bookId))
          .get()
          .then(this.loadBook)
          .catch(err => {
            console.log("Error getting document from books collection", err);

            this.setState({
              books: []
            });
          });
      });
    }
  }
  async loadAllBooks() {
    const db = firebase.firestore();
    return db
      .collection("books")
      .get()
      .then(snapshot => {
        snapshot.forEach(this.loadBook);
      })
      .catch(err => {
        console.log("Error getting document from books collection", err);

        this.setState({
          books: []
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
                  } else if (this.props.allBooks) {
                    this.loadAllBooks();
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
