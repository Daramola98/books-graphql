import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import swal from '@sweetalert/with-react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { getBooksQuery, deleteBookMutation } from '../queries/queries';
import BookDetails from './BookDetails';
import EditBook from './EditBook';

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql"
  });

class BookList extends Component {
    showBookDetails = (bookId) => {
        swal({
            text: "Book Details",
            buttons: {
              cancel: "Close",
            },
            content: (
              <div>
                <ApolloProvider client={client}>
                  <BookDetails bookId={bookId}/>
                </ApolloProvider>
              </div>
            )
          })
    }

    editBookDetails = (book) => {
        swal({
            text: "Edit Book Details",
            buttons: {
              cancel: "Close",
            },
            content: (
              <div>
                <ApolloProvider client={client}>
                  <EditBook book={book}/>
                </ApolloProvider>
              </div>
            )
          })
    }

    deleteBook = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Book!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              this.props.deleteBookMutation({
                variables: {
                    id
                },
                refetchQueries: [{ query: getBooksQuery }]
            });
              swal("Poof! Your Book has been deleted!", {
                icon: "success",
              });
            } else {
              swal("Your Book is safe!");
            }
          });
    }

    displayBooks = (books) => {
        return books.map(book => {
            return (
                <li className="collection-item" key={book.id}>
                  <div>{book.name}
                   <span onClick={() => this.showBookDetails(book.id)} className="secondary-content"><i className="material-icons">send</i></span>
                   <span onClick={() => this.editBookDetails(book)} className="secondary-content"><i className="material-icons">edit</i></span>
                   <span onClick={() => this.deleteBook(book.id)} className="secondary-content"><i className="material-icons">delete</i></span>
                  </div>
                </li>
            );
        })
    }
    render() {
        const { data } = this.props;
        return (
            <div>
                <ul id="book-list" className="collection with-header">
                    <li className="collection-header"><h4 className="center">Books</h4></li>
                    {data.loading ? <div>Loading Books...</div> : this.displayBooks(data.books)}
                </ul>

            </div>
        );
    }
}

export default compose(
    graphql(getBooksQuery),
    graphql(deleteBookMutation, { name: "deleteBookMutation"})
)(BookList);