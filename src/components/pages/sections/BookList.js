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
  MDBIcon,
  MDBModalFooter
} from "mdbreact";

const booksInRow = 5;

export class BookCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: this.props.book,
      currentHolder: ""
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", this.props.book.currentHolder)
      .get()
      .then(snapshot => {
        snapshot.forEach(data => {
          this.setState({
            currentHolder: data.data().fullname
          });
        });
      })
      .catch(err => {
        console.log(err.message);
      });
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
          style={{ height: "23rem", width: "12rem" }}
        >
          <MDBCardBody>
            <h5 className="font-weight-bold mb-3">
              {this.state.book.title} by {this.state.book.author}
            </h5>
            <p className="font-weight-bold grey-text">
              current user: {this.state.currentHolder}
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
      editable: this.props.editable,
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

    this.props
      .updateBook(this.props.bookId, this.state.name, this.state.value)
      .then(() => {
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
            {this.state.isEditing && this.state.editable ? (
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
                {this.state.editable && (
                  <MDBCol>
                    {this.state.isUpdating ? (
                      <MDBBtn disabled={true} color="primary">
                        Updating...
                      </MDBBtn>
                    ) : (
                      <MDBIcon onClick={this.toggleEdit} icon="edit" />
                    )}
                  </MDBCol>
                )}
              </MDBRow>
            )}
          </MDBCol>
        </MDBRow>
        <br />
      </React.Fragment>
    );
  }
}

export class BookModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
      gettingBook: false,
      askingBook: false,
      accepting: false,
      rejecting: false
    };
  }

  deleteBook = () => {
    console.log("Deleting the book!");
    this.setState({
      isDeleting: true
    });

    this.props.deleteBook(this.props.book.uid).then(() => {
      this.setState({
        isDeleting: false
      });
      this.props.toggle();
    });
  };
  deleteRequest = () => {
    return firebase
      .firestore()
      .collection("requests")
      .doc(String(this.props.book.reqId))
      .delete()
      .then(() => {
        console.log("Deleted Request!!!");
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  acceptBook = () => {
    console.log("Accepting book");
    this.setState({
      accepting: true
    });
    this.deleteRequest()
      .then(() => {
        this.props.acceptBook(this.props.book).then(() => {
          this.setState({
            accepting: false
          });
          this.props.toggle();
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  rejectBook = () => {
    console.log("Rejecting book");
    this.setState({
      rejecting: true
    });
    this.setState({
      rejecting: false
    });
    this.props.toggle();
  };

  getBook = () => {
    console.log("Getting book");
    console.log(this.props.book.currentHolder, this.props.user.uid);
    this.setState({
      gettingBook: true
    });
    this.props.getBook(this.props.book.currentHolder).then(() => {
      this.setState({
        gettingBook: false
      });
      this.props.toggle();
    });
  };

  askBook = () => {
    console.log("Asking book");
    this.setState({
      askingBook: true
    });
    this.props.askBook(this.props.book).then(() => {
      this.setState({
        askingBook: false
      });
      this.props.toggle();
    });
  };
  render() {
    return (
      <React.Fragment>
        {this.props.book != null && (
          <MDBModal
            size="lg"
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
          >
            <MDBModalHeader toggle={this.props.toggle}>
              Book Details
            </MDBModalHeader>
            <MDBModalBody>
              <MDBContainer>
                <React.Fragment>
                  <BookField
                    name="title"
                    label="Title"
                    value={this.props.book.title}
                    bookId={this.props.book.uid}
                    editable={this.props.book.owner === this.props.user.uid}
                    updateBook={this.props.updateBook}
                  />
                  <BookField
                    name="author"
                    label="Author"
                    value={this.props.book.author}
                    bookId={this.props.book.uid}
                    editable={this.props.book.owner === this.props.user.uid}
                    updateBook={this.props.updateBook}
                  />
                  <BookField
                    name="publisher"
                    label="Publisher"
                    value={this.props.book.publisher}
                    bookId={this.props.book.uid}
                    editable={this.props.book.owner === this.props.user.uid}
                    updateBook={this.props.updateBook}
                  />
                  <BookField
                    name="description"
                    label="Description"
                    value={this.props.book.description}
                    bookId={this.props.book.uid}
                    editable={this.props.book.owner === this.props.user.uid}
                    updateBook={this.props.updateBook}
                  />
                </React.Fragment>
              </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
              {this.props.user.uid != this.props.book.owner &&
                this.props.book.owner == this.props.book.currentHolder &&
                this.props.askBook && (
                  <MDBBtn
                    disabled={this.state.askingBook}
                    onClick={this.askBook}
                    color="unique"
                  >
                    {this.state.gettingBook
                      ? "Requesting..."
                      : "Request the book"}
                  </MDBBtn>
                )}
              {this.props.book.person && (
                <MDBBtn
                  disabled={this.state.accepting}
                  onClick={this.acceptBook}
                  color="dark-green"
                >
                  {this.state.accepting ? "Accepting..." : "Accept the request"}
                </MDBBtn>
              )}
              {this.props.book.person && (
                <MDBBtn
                  disabled={this.state.rejecting}
                  onClick={this.rejectBook}
                  color="pink"
                >
                  {this.state.accepting ? "Rejecting..." : "Reject the request"}
                </MDBBtn>
              )}
              {this.props.user.uid == this.props.book.owner &&
                this.props.user.uid != this.props.book.currentHolder && (
                  <MDBBtn
                    disabled={this.state.gettingBook}
                    onClick={this.getBook}
                    color="indigo"
                  >
                    {this.state.gettingBook ? "Getting back..." : "Get back"}
                  </MDBBtn>
                )}
              {this.props.user.uid == this.props.book.owner && (
                <MDBBtn
                  disabled={this.state.isDeleting}
                  onClick={this.deleteBook}
                  color="danger"
                >
                  {this.state.isDeleting ? "Deleting..." : "Delete"}
                </MDBBtn>
              )}
            </MDBModalFooter>
          </MDBModal>
        )}
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

  updateBook = (bookId, name, value) => {
    const bookRef = firebase
      .firestore()
      .collection("books")
      .doc(bookId);
    return bookRef.update({ [name]: value }).then(() => {
      const { books } = this.state;
      for (let i = 0; i < books.length; ++i) {
        if (books[i].uid === bookId) {
          books[i][name] = value;
        }
      }
      this.setState({
        books: books
      });
    });
  };

  deleteBook = bookId => {
    const bookRef = firebase
      .firestore()
      .collection("books")
      .doc(bookId);
    return bookRef.delete().then(() => {
      const { books } = this.state;
      for (let i = 0; i < books.length; ++i) {
        if (books[i].uid === bookId) {
          books.splice(i, 1);
          break;
        }
      }
      this.setState({
        books: books
      });
    });
  };
  askBook = book => {
    return firebase
      .firestore()
      .collection("requests")
      .doc()
      .set({
        bookId: book.uid,
        newHolderId: this.state.user.uid,
        ownerId: book.owner
      })
      .then(() => {
        console.log("requested!");
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  acceptBook = book => {
    return firebase
      .firestore()
      .collection("books")
      .doc(String(book.uid))
      .update({
        currentHolder: book.person
      })
      .then(() => {
        console.log("accepted!");
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  getBook = async currentHolder => {
    const notRef = firebase
      .firestore()
      .collection("notifications")
      .doc();
    try {
      await notRef.set({
        fromUser: this.state.user.fullname,
        isRead: false,
        message: "can you give me back my book?",
        toUser: currentHolder
      });
      console.log("notified!");
    } catch (err) {
      console.log(err.message);
    }
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
  loadReqBooks = () => {
    firebase
      .firestore()
      .collection("requests")
      .where("ownerId", "==", String(this.state.user.uid))
      .get()
      .then(reqs => {
        reqs.forEach(req => {
          firebase
            .firestore()
            .collection("books")
            .doc(String(req.data().bookId))
            .get()
            .then(book => {
              let new_book = book.data();
              new_book.uid = book.id;
              new_book.person = req.data().newHolderId;
              new_book.reqId = req.id;
              this.setState({
                books: [...this.state.books, new_book]
              });
            })
            .catch(err => {
              console.log(err.message);
            });
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  };
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
                  if (this.props.reqBooks) {
                    this.loadReqBooks();
                  } else if (this.props.markedBooks) {
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
            console.log("Error user from users collection", err);
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
        <BookModal
          isOpen={this.props.modalBook}
          toggle={this.toggleBook}
          book={this.state.bookOpened}
          user={this.state.user}
          updateBook={this.updateBook}
          deleteBook={this.deleteBook}
          getBook={this.getBook}
          askBook={this.askBook}
          acceptBook={this.acceptBook}
        />
      </React.Fragment>
    );
  }
}

export default BookList;
