const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;

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
        authorId: {
            type: GraphQLID
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId)
                    .then((author) => {
                        if (author) {
                            return author;
                        }
                        return;
                    })
                    .catch((err) => {
                        if (err) {
                            return err;
                        }
                    });
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
            resolve(parent, args) {
                return Book.find({ authorId: parent.id })
                    .then((book) => {
                        if (book) {
                            return book;
                        }
                        return;
                    })
                    .catch((err) => {
                        if (err) {
                            return err;
                        }
                    });
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        editAuthor: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
                name: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                }
            },
            async resolve(parent, args) {
                try {
                    let author = await Author.findById(args.id);
                     author.name = args.name || author.name;
                     author.age = args.age || author.age;
                    return author.save();
                } catch (err) {
                    return err;
                }

            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                authorId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            async resolve(parent, args) {
                const { name, genre, authorId } = args;
                try {
                    let author = await Author.findById(args.id);
                     if (!author) {
                        let book = new Book({
                            name,
                            genre,
                            authorId
                        });
                        return book.save();
                     } else {
                        throw new Error("Author Does not Exist");
                     }
                } catch (err) {
                    return err;
                }
                
            }
        },
        editBook: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
                name: {
                    type: GraphQLString
                },
                genre: {
                    type: GraphQLString
                },
                authorId: {
                    type: GraphQLID
                }
            },
            async resolve(parent, args) {
                try {
                    let book = await Book.findById(args.id);
                     book.name = args.name || book.name;
                     book.genre = args.genre || book.genre;
                     book.authorId = args.authorId || book.authorId;
                    return book.save();
                } catch (err) {
                    return err;
                }

            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                }
            },
            async resolve(parent, args) {
                try {
                    let book = await Book.findByIdAndDelete(args.id);
                    return "Book Deleted Successfully"
                } catch (err) {
                    return err;
                }

            }
        },
    }
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
            resolve(parent, args) {
                return Book.findById(args.id)
                    .then((book) => {
                        if (book) {
                            return book;
                        }
                        return;
                    })
                    .catch((err) => {
                        if (err) {
                            return err;
                        }
                    });
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Author.findById(args.id)
                    .then((author) => {
                        if (author) {
                            return author;
                        }
                        return;
                    })
                    .catch((err) => {
                        if (err) {
                            return err;
                        }
                    });
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
            resolve(parent, args) {
                const filterBy = {};
                if (args.age) {
                    filterBy.age = args.age;
                }
                if (args.name) {
                    filterBy.name = args.name;
                }
                return Author.find(filterBy)
                    .then((authors) => {
                        if (authors) {
                            return authors;
                        }
                        return;
                    })
                    .catch((err) => {
                        if (err) {
                            return err;
                        }
                    });
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
            resolve(parent, args) {
                const filterBy = {};
                if (args.genre) {
                    filterBy.genre = args.genre;
                }
                if (args.name) {
                    filterBy.name = args.name;
                }
                return Book.find(filterBy)
                    .then((books) => {
                        if (books) {
                            return books;
                        }
                        return;
                    })
                    .catch((err) => {
                        if (err) {
                            return err;
                        }
                    });
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
