import React from 'react';

const BooksPage = async () => {
    const res = await fetch(`http://localhost:8000/books`, {
    cache: 'no-store'
  });
  const data = await res.json();
    return (
        <div>
            {
                data.map((e,i) => <BookCard data={e} key={i}/>)
            }
        </div>
    );
};

export default BooksPage;