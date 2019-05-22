const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const _ = require('lodash');
const { // define mysql connectors
  Book,
  Author
} = require('../connectors/mysqlDB');

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        //return _.find(authors, { id: parent.authorId });
        return Author.findOne({ where: { id: parent.authorId } });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return _.filter(books, { authorId: parent.id } );
        return Book.findAll({ where: { authorId: parent.id } });
      }
    }
  })
});

const BaseQuery = new GraphQLObjectType({
  name: 'BaseQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        console.log(typeof(args.id));
        //return _.find(books, {id: args.id});
        return Book.findOne({ where: { id: args.id } });
      }
    },
    author: {
      type: AuthorType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        console.log(typeof(args.id));
        //return _.find(authors, {id: args.id});
        return Author.findOne({ where: { id: args.id } });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return books;
        return Book.findAll({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        //return authors;
        return Author.findAll({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: BaseQuery,
  mutation: Mutation
});
