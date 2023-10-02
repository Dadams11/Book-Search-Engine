import React, { useState } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';

import { SAVE_BOOK } from './mutations';
import Auth from '../utils/auth';

const SearchBooks = () => {
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [saveBook, { error }] = useMutation(SAVE_BOOK);

    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchInput(value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Logic for searching books using Google API or another mechanism...
        // For example, you'd call an external API, get a list of books, and then:
        setSearchedBooks( /* Array of books from the search result */ );
    };

    const handleSaveBook = async (bookData) => {
        const bookToSave = {
            bookId: bookData.id,
            authors: bookData.authors,
            description: bookData.description,
            title: bookData.title,
            image: bookData.image,
            link: bookData.link
        };

        try {
            await saveBook({
                variables: { input: bookToSave }
            });

            // Logic to manage local state if required...

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container>
            <Jumbotron fluid className='text-light bg-dark'>
                <Container>
                    <h1>Search for Books!</h1>
                    {/* Search form and other JSX */}
                </Container>
            </Jumbotron>
            <Container>
                <CardColumns>
                    {searchedBooks.map((book) => {
                        return (
                            <Card key={book.id} border='dark'>
                                {/* Display book data */}
                                <Button onClick={() => handleSaveBook(book)}>Save Book</Button>
                            </Card>
                        );
                    })}
                </CardColumns>
                {error && <div>Error saving the book</div>}
            </Container>
        </Container>
    );
};

export default SearchBooks;
