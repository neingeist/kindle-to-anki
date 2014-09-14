#!/usr/bin/env python3
from bs4 import BeautifulSoup
from re import sub


def extract_books(soup):
    """Extract books from the given soup."""
    books = {}
    for d in soup.find_all('div', 'bookMain'):
        asin = sub(r'_.*$', '', d['id'])
        title = d.find('span', 'title').text.strip()
        author = sub(r'by ', '', d.find('span', 'author').text.strip())
        author = sub('\n', '', author)

        books[asin] = dict(asin=asin, title=title, author=author)

    return books


def extract_highlights(soup, books):
    """Extract highlights from a soup."""
    clippings = []
    for d in soup.find_all('div', 'yourHighlight'):
        try:
            clipping_text = d.find('span', 'highlight').text
            clipping_text = sub('\n', '', clipping_text)
            asin = d.find('span', 'asin').text
            loc = d.find('span', 'end_location').text
            book = books[asin]
            clipping = {
                'book': '{} ({})'.format(book['title'], book['author']),
                'clipping_text': clipping_text,
                'location': loc,
                'date': '',
            }
            clippings.append(clipping)
        except AttributeError:
            pass
    return clippings


def main():
    with open("Highlights.html") as f:
        soup = BeautifulSoup(f)
        books = extract_books(soup)

        clippings = extract_highlights(soup, books)
        for clipping in clippings:
            print("\t".join([clipping['book'],
                             clipping['clipping_text'],
                             clipping['location'],
                             clipping['date']]))


if __name__ == '__main__':
    main()

# vim:set fileencoding=utf-8:
