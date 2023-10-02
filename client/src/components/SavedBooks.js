import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { GET_ME } from './queries';  // Adjust the path as necessary
import { REMOVE_BOOK } from './mutations';  // Adjust the path as necessary
import Auth from '../utils/auth';

const SavedBooks = () => {
    const { loading, data } = useQuery(GET_ME);
    const [removeBook] = useMutation(REMOVE_BOOK);

    const userData = data?.me || {};

    // Create function to handle deleting a book from the saved books list
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        
        if (!token) {
            return false;
        }

        try {
            await removeBook({
                variables: { bookId },
                update: (cache) => {
                    const existingBooks = cache.readQuery({ query: GET_ME });
                    const newBookList = existingBooks.me.savedBooks.filter((book) => book.bookId !== bookId);
                    cache.writeQuery({ query: GET_ME, data: { me: { ...existingBooks.me, savedBooks: newBookList } } });
                }
            });

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <h2>LOADING...</h2>;

    return (
        <Container>
            <Jumbotron fluid className='text-light bg-dark'>
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </Jumbotron>
            <Container>
                <h2>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <CardColumns>
                    {userData.savedBooks.map((book) => {
                        return (
                            <Card key={book.bookId} border='dark'>
                                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                <Card.Body>
                                    <Card.Title>{book.title}</Card.Title>
                                    <p className='small'>Authors: {book.authors}</p>
                                    <Card.Text>{book.description}</Card.Text>
                                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                                        Delete this Book!
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardColumns>
            </Container>
        </Container>
    );
};

export default SavedBooks;
