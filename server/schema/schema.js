const graphql = require('graphql');
const _ = require('lodash');
const books =  require('../dummyData/books');
const authors = require('../dummyData/authors');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLSchema, GraphQLList } = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, { authorId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args){
              return _.find(books, { id: args.id });
            }
          },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args){
                return _.find(authors, { id: args.id })
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            args: {
                age: {
                    type: GraphQLInt
                },
                name: {
                    type: GraphQLString
                }
            },
            resolve(parent, args){
                if (args.age){
                    return _.filter(authors, { age : args.age })
                }
                if (args.name){
                    return _.filter(authors, { name : args.name })
                }
                return authors;
            }
        },
        books: {
            type: new GraphQLList(BookType),
            args: {
                genre: {
                    type: GraphQLString
                },
                name: {
                    type: GraphQLString
                }
            },
            resolve(parent, args){
                if (args.genre){
                    return _.filter(books, { genre : args.genre })
                }
                if (args.name){
                    return _.filter(books, { name : args.name })
                }
                return books;
            }
        }
        }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});
