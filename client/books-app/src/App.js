import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// Components
import BookList from './components/BookList';
import AddBook from './components/AddBook';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
       <div className="container">
       <div id="main">
          <h1 className="center">Daramola's Reading List</h1>
          <div className="row">
            <div className="col s6">
              <BookList />
            </div>
            <div className="col s6">
              <AddBook />
            </div>
          </div>
      </div>
      </div>  
      </ApolloProvider>  
    );
  }
}
export default App;