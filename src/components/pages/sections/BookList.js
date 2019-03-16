import React from "react";
import firebase from "../../../Firestore";
import {
  MDBTableBody,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBRow,
  MDBContainer,
  Input,
  MDBModal,
  MDBModalHeader,
  MDBModalBody
} from "mdbreact";

export class BookCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: this.props.book
    };
  }

  shortText = text => {
    const limit = this.props.charLimit || 170;
    if (text.length > limit) return text.substring(0, limit) + "...";
    return text.substring(0, text.length);
  };

  toggleBook = () => {
    this.props.toggleBook(this.state.book);
  };

  render() {
    return (
      <MDBCol>
        <MDBCard
          onClick={this.toggleBook}
          style={{ height: "20rem", width: "12rem" }}
        >
          <MDBCardBody>
            <h5 className="font-weight-bold mb-3">{this.state.book.title}</h5>
            <p className="font-weight-bold grey-text">
              by {this.state.book.author}
            </p>
            <MDBCardText>
              {this.shortText(this.state.book.description)}
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
}

class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      books: [],
      bookOpened: null,
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

  split = (arr, len) => {
    let res = [];
    for (let i = 0; i < arr.length; i += len) {
      res.push(arr.slice(i, Math.min(i + len, arr.length)));
    }
    return res;
  };

  toggleBook = (book = null) => {
    this.setState({
      bookOpened: book
    });
    this.props.toggleBook();
  };

  render() {
    const { user } = this.state;
    const { books } = this.state;
    const splitBooks = this.split(books, 4);

    const bookCardsTable = splitBooks.map(block => {
      return (
        <div key={block[0].uid}>
          <MDBRow>
            {block.map(book => {
              return (
                <BookCard
                  toggleBook={this.toggleBook}
                  book={book}
                  key={book.uid}
                />
              );
            })}
          </MDBRow>
          <br />
        </div>
      );
    });

    return (
      <React.Fragment>
        <MDBContainer>
          {bookCardsTable}
          {books.length === 0 && user && <p>You have no books.</p>}
          {!user && <p>Please, log in.</p>}
        </MDBContainer>
        <MDBModal
          size="lg"
          isOpen={this.props.modalBook && this.state.bookOpened != null}
          toggle={this.toggleBook}
        >
          <MDBModalHeader toggle={this.toggleBook}>Book Details</MDBModalHeader>
          <MDBModalBody>
            <MDBContainer>
              <MDBRow>
                <MDBCol size="2" className="grey-text">
                  Title:
                </MDBCol>
                <MDBCol>
                  {this.state.bookOpened != null && this.state.bookOpened.title}
                </MDBCol>
              </MDBRow>
              <br />

              <MDBRow>
                <MDBCol size="2" className="grey-text">
                  Author:
                </MDBCol>
                <MDBCol>
                  {this.state.bookOpened != null &&
                    this.state.bookOpened.author}
                </MDBCol>
              </MDBRow>
              <br />

              <MDBRow>
                <MDBCol size="2" className="grey-text">
                  Publisher:
                </MDBCol>
                <MDBCol>
                  {this.state.bookOpened != null &&
                    this.state.bookOpened.publisher}
                </MDBCol>
              </MDBRow>
              <br />

              <MDBRow>
                <MDBCol size="2" className="grey-text">
                  Description:
                </MDBCol>
                <MDBCol>
                  {this.state.bookOpened != null &&
                    this.state.bookOpened.description}
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBModalBody>
        </MDBModal>
      </React.Fragment>
    );
  }
}

export default BookList;
