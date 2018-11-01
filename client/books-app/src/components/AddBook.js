import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';

class AddBook extends Component {
    state = {
        name: '',
        genre: '',
        authorId: ''
    }

    onChange = (event) => this.setState({ [event.target.name]: event.target.value });

    submitForm = (event) => {
        event.preventDefault();
        // use the addBookMutation
        this.props.addBookMutation({
            variables: {
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries: [{ query: getBooksQuery }]
        });
        this.setState({ name: '', genre: '', authorId: '' });
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
                <h2 className="center">Add a Book</h2>
                <form id="add-book" onSubmit={this.submitForm}>
                    <div className="field">
                        <label>Book name:</label>
                        <input type="text" name="name" onChange={this.onChange} value={name} required />
                    </div>
                    <div className="field">
                        <label>Genre:</label>
                        <input type="text" name="genre" onChange={this.onChange} value={genre} required />
                    </div>
                    <div className="field">
                        <label>Author:</label>
                        <select className="browser-default" name="authorId" value={authorId} onChange={this.onChange}>
                            <option>Select Author</option>
                            {this.displayAuthors()}
                        </select>
                    </div>
                    <br />
                    <div className="center">
                        <button className="btn waves-effect waves-light center-align" type="submit" name="action">Submit
                        <i className="material-icons right">send</i>
                        </button>
                    </div>
                    <br />
                </form>
            </div>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery),
    graphql(addBookMutation, { name: "addBookMutation" }))(AddBook);