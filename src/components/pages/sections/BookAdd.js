import React from "react";
import firebase from "../../../Firestore";
import { toast, MDBBtn, MDBContainer } from "mdbreact";

class BookAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: false,
      title: "",
      author: "",
      publisher: "",
      description: ""
    };
  }

  clearForm = () => {
    this.setState({
      isLoading: false,
      title: "",
      author: "",
      publisher: "",
      description: ""
    });
  };

  addBook = async () => {
    this.setState({
      isLoading: true
    });

    if (!this.state.user) {
      this.setState({
        isLoading: false
      });
      toast.error("You are not logged in. Please, log in.", {
        autoClose: 3000
      });
      return;
    }

    const db = firebase.firestore();
    return db
      .collection("books")
      .add({
        title: this.state.title,
        author: this.state.author,
        publisher: this.state.publisher,
        description: this.state.description,
        usersLiked: [],
        ownerUserId: this.state.user.id,
        currentUserId: this.state.user.id
      })
      .then(ref => {
        console.log("Added book with ID: ", ref.id);
        toast.success("Book was added successfully!", {
          autoClose: 3000
        });
        this.clearForm();
      })
      .catch(err => {
        console.log("Error getting document from books collection", err);
        toast.error("Error occured.", {
          autoClose: 3000
        });
        this.clearForm();
      });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user
        });
      } else {
        this.setState({
          user: null
        });
      }
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <React.Fragment>
        <MDBContainer>
          <form>
            <p className="h4 text-center mb-4">Добавить книгу</p>
            <label htmlFor="bookForm.title" className="grey-text">
              Название
            </label>
            <input
              value={this.state.title}
              name="title"
              onChange={this.handleChange}
              type="text"
              id="bookForm.title"
              className="form-control"
            />
            <br />
            <label htmlFor="bookForm.author" className="grey-text">
              Автор
            </label>
            <input
              value={this.state.author}
              name="author"
              onChange={this.handleChange}
              type="text"
              id="bookForm.author"
              className="form-control"
            />
            <br />
            <label htmlFor="bookForm.publisher" className="grey-text">
              Издание
            </label>
            <input
              value={this.state.publisher}
              name="publisher"
              onChange={this.handleChange}
              type="text"
              id="bookForm.publisher"
              className="form-control"
            />
            <br />
            <label htmlFor="bookForm.description" className="grey-text">
              Описание
            </label>
            <input
              value={this.state.description}
              name="description"
              onChange={this.handleChange}
              type="text"
              id="bookForm.description"
              className="form-control"
              rows="3"
            />
            <div className="text-center mt-4">
              <MDBBtn onClick={this.addBook} color="unique">
                Добавить
              </MDBBtn>
            </div>
          </form>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

export default BookAddForm;
