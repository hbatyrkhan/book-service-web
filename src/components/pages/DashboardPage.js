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
      subscription: null,
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
                  user: data.data(),
                  subscription: firebase
                    .firestore()
                    .collection("notifications")
                    .onSnapshot(function(snapshot) {
                      console.log("triggered...", snapshot.docChanges());

                      snapshot.docChanges().forEach(doc => {
                        console.log("Current data: ", doc.type, doc.doc.data());
                        console.log(doc.doc.data().toUser, data.data().uid);
                        console.log(doc.doc.data().isRead);
                        if (doc.type === "added") {
                          if (
                            doc.doc.data().toUser === data.data().uid &&
                            doc.doc.data().isRead === false
                          ) {
                            toast.info(
                              doc.doc.data().fromUser +
                                ": " +
                                doc.doc.data().message,
                              {
                                autoClose: false
                              }
                            );
                            console.log("Should have seen this notify action");
                            self.readDelNotification(doc.doc.id);
                          }
                        }
                      });
                    })
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
  componentWillUnmount() {
    console.log("Unmounting...");
    if (this.state.subscription) {
      this.state.subscription();
    }
    this.setState({
      subscription: null
    });
  }
  readDelNotification = async id => {
    try {
      await firebase
        .firestore()
        .collection("notifications")
        .doc(id)
        .delete();
      console.log("Changed!!!");
    } catch (err) {
      console.log(err.message);
    }
  };
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
        <TableSection />
        <ChartSection2 />
        <MDBRow className="mb-4">
          <MapSection />
          <ModalSection />
        </MDBRow>
        <AdminCardSection2 />
      </React.Fragment>
    );
  }
}

export default DashboardPage;
