import React from "react";
import { MDBRow, MDBTable, ToastContainer, toast } from "mdbreact";
import AdminCardSection1 from "./sections/AdminCardSection1";
import AdminCardSection2 from "./sections/AdminCardSection2";
import TableSection from "./sections/TableSection";
import BreadcrumSection from "./sections/BreadcrumSection";
import ChartSection1 from "./sections/ChartSection1";
import ChartSection2 from "./sections/ChartSection2";
import MapSection from "./sections/MapSection";
import ModalSection from "./sections/ModalSection";
import BookList from "./sections/BookList";
import firebase from "./../../Firestore";

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryInput: "",
      modalBook: false,
      user: null
    };
  }
  componentDidMount() {
    const self = this;
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
                () => {}
              );
            });
          })
          .catch(err => {
            // console.log("Error user from users collection", err);
            this.setState({
              user: null
            });
          });
      } else {
        this.setState({
          user: null
        });
      }
    });
  }
  componentWillUnmount() {}
  handlerInput = value => {
    this.setState({
      queryInput: value
    });
  };

  toggleBook = () => {
    this.setState({
      modalBook: !this.state.modalBook
    });
  };

  render() {
    return (
      <React.Fragment>
        <BreadcrumSection handler={this.handlerInput} />
        {false && <AdminCardSection1 />}
        {false && <ChartSection1 />}
        <BookList
          allBooks
          queryInput={this.state.queryInput}
          modalBook={this.state.modalBook}
          toggleBook={this.toggleBook}
        />
      </React.Fragment>
    );
  }
}

export default DashboardPage;
