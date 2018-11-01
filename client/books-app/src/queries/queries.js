import { gql } from 'apollo-boost';

const getAuthorsQuery = gql`
    {
        authors {
            name
            id
        }
    }
`;

const getBooksQuery = gql`
    {
        books {
            name
            id
            genre
            authorId
        }
    }
`;

const addBookMutation = gql`
    mutation AddBook($name: String!, $genre: String!, $authorId: ID!){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`;

const editBookMutation = gql`
    mutation EditBook($id: ID!, $name: String, $genre: String, $authorId: ID){
        editBook(id: $id, name: $name, genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`;

const deleteBookMutation = gql`
    mutation DeleteBook($id: ID!){
        deleteBook(id: $id){
            name
        }
    }
`;

const getBookQuery = gql`
    query GetBook($id: ID){
        book(id: $id) {
            id
            name
            genre
            author {
                id
                name
                age
                books {
                    name
                    id
                }
            }
        }
    }
`;

export { getAuthorsQuery, getBooksQuery, addBookMutation, editBookMutation, deleteBookMutation, getBookQuery };