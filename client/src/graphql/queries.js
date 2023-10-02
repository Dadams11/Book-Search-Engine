const { gql } = require('@apollo/client');

const GET_ME = gql`
    query me {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
`;

export { GET_ME };
