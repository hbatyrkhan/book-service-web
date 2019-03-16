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
  MDBModalBody,
  MDBBtn,
  MDBIcon
} from "mdbreact";

const booksInRow = 5;

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

export class BookField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      label: this.props.label,
      value: this.props.value,
      oldValue: this.props.value,
      isEditing: false,
      isUpdating: false
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggleEdit = () => {
    this.setState({
      oldValue: this.state.isEditing ? this.state.oldValue : this.state.value,
      isEditing: !this.state.isEditing
    });
  };

  cancelEdit = () => {
    this.setState({
      value: this.state.oldValue,
      isEditing: false
    });
  };

  updateBook = () => {
    console.log("Updating the book");
    this.setState({
      isUpdating: true,
      isEditing: false
    });

    const bookRef = firebase
      .firestore()
      .collection("books")
      .doc(this.props.bookId);
    bookRef.update({ [this.state.name]: this.state.value }).then(() => {
      console.log("Book was updated");
      this.setState({
        isUpdating: false,
        isEditing: false
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <MDBRow>
          <MDBCol size="2" className="grey-text">
            <p>{this.state.label}:</p>
          </MDBCol>
          <MDBCol>
            {this.state.isEditing ? (
              <MDBRow>
                <MDBCol>
                  <input
                    value={this.state.value}
                    name="value"
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
                  />
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    disabled={this.state.isUpdating}
                    onClick={this.updateBook}
                    color="primary"
                  >
                    {this.state.isUpdating ? "Updating..." : "Update"}
                  </MDBBtn>
                  <MDBBtn
                    disabled={this.state.isUpdating}
                    onClick={this.cancelEdit}
                    color="grey"
                  >
                    Cancel
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            ) : (
              <MDBRow>
                <MDBCol>{this.state.value}</MDBCol>
                <MDBCol>
                  {this.state.isUpdating ? (
                    <MDBBtn disabled={true} color="primary">
                      Updating...
                    </MDBBtn>
                  ) : (
                    <MDBIcon onClick={this.toggleEdit} icon="edit" />
                  )}
                </MDBCol>
              </MDBRow>
            )}
          </MDBCol>
        </MDBRow>
        <br />
      </React.Fragment>
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
    if (this.props.queryInput !== nextProps.queryInput) {
      const self = this;
      this.setState(
        {
          queryInput: nextProps.queryInput
        },
        () => {
          const tmp_books = [...this.state.books];
          tmp_books.sort(function(item1, item2) {
            return self.getRelevance(item1) < self.getRelevance(item2) ? 1 : -1;
          });
          this.setState({
            books: tmp_books
          });
        }
      );
    }
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
      return self.getRelevance(item1) < self.getRelevance(item2) ? 1 : -1;
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
    while (res.length > 0 && res[res.length - 1].length % len != 0)
      res[res.length - 1].push(null);
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
    const splitBooks = this.split(books, booksInRow);

    const bookCardsTable = splitBooks.map(block => {
      return (
        <div key={block[0].uid}>
          <MDBRow>
            {block.map((book, index) => {
              return (
                <React.Fragment key={book === null ? index : book.uid}>
                  {book != null ? (
                    <BookCard
                      toggleBook={this.toggleBook}
                      book={book}
                      key={book.uid}
                    />
                  ) : (
                    <MDBCol />
                  )}
                </React.Fragment>
              );
            })}
          </MDBRow>
          <br />
        </div>
      );
    });

    return (
      <React.Fragment>
        <MDBContainer className="flex-wrap">
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
              {this.state.bookOpened != null && (
                <React.Fragment>
                  <BookField
                    name="title"
                    label="Title"
                    value={this.state.bookOpened.title}
                    bookId={this.state.bookOpened.uid}
                  />
                  <BookField
                    name="author"
                    label="Author"
                    value={this.state.bookOpened.author}
                    bookId={this.state.bookOpened.uid}
                  />
                  <BookField
                    name="publisher"
                    label="Publisher"
                    value={this.state.bookOpened.publisher}
                    bookId={this.state.bookOpened.uid}
                  />
                  <BookField
                    name="description"
                    label="Description"
                    value={this.state.bookOpened.description}
                    bookId={this.state.bookOpened.uid}
                  />
                </React.Fragment>
              )}
            </MDBContainer>
          </MDBModalBody>
        </MDBModal>
      </React.Fragment>
    );
  }
}

export default BookList;
