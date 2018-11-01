import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import swal from '@sweetalert/with-react';
import { getAuthorsQuery, editBookMutation, getBooksQuery } from '../queries/queries';

class EditBook extends Component {
    state = {
        name: null,
        genre: null,
        authorId: null
    }

    static getDerivedStateFromProps(props, state) {
        if (state.name === null && props.book.name !== state.name) {
          return {
            name: props.book.name,
            genre: props.book.genre,
            authorId: props.book.authorId
          };
        } else {
            return {
              name: state.name,
              genre: state.genre,
              authorId: state.authorId
            }
        }
      }

    onChange = (event) => this.setState({ [event.target.name]: event.target.value });

    submitForm = (event) => {
        event.preventDefault();
        // use the editBookMutation
        this.props.editBookMutation({
            variables: {
                id: this.props.book.id,
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries: [{ query: getBooksQuery }]
        });
        this.setState({ name: '', genre: '', authorId: '' });
        swal("Edited Successfully", "Book Edited", "success")
        window.setTimeout(() => window.location.reload(), 3000);
    }

    displayAuthors = () => {
        var data = this.props.data;
        if (data.loading) {
            return (<option disabled>Loading authors...</option>);
        } else {
            return data.authors.map(author => {
                return (<option key={author.id} value={author.id}>{author.name}</option>);
            });
        }
    }

    render() {
        const { name, genre, authorId } = this.state;
        return (
            <div className="container">
                <form id="add-book" onSubmit={this.submitForm}>
                    <div className="field">
                        <label>Book name:</label>
                        <input type="text" name="name" onChange={this.onChange} value={name} />
                    </div>
                    <div className="field">
                        <label>Genre:</label>
                        <input type="text" name="genre" onChange={this.onChange} value={genre} />
                    </div>
                    <div className="field">
                        <label>Author:</label>
                        <select className="browser-default" name="authorId" value={authorId} onChange={this.onChange}>
                            <option>Select Author</option>
                            {this.displayAuthors()}
                        </select>
                    </div>
                    <br />
                    <button className="btn waves-effect waves-light center" type="submit" name="action">Submit
                        <i className="material-icons right">send</i>
                    </button>
                    <br />
                </form>
            </div>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery),
    graphql(editBookMutation, { name: "editBookMutation" }))(EditBook);