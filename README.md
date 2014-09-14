Kindle → Anki
=============

My Clippings.txt from your Kindle
---------------------------------

Convert a Kindle "My Clippings.txt" file to a tab-separated values file. Anki
can import this file.

It's work in progress. Don't use it.

     node kindle-to-anki.js My\ Clippings.txt

Highlights in HTML
------------------

For highlights downloaded from Amazon's ["Your Highlights"](https://kindle.amazon.com/your_highlights)
page, use `kindle-html-to-anki.py`.

     mv Foo\ Highlights.html Highlights.html
     python3 kindle-html-to-anki.py > anki-import.txt

Order of the fields exported
----------------------------
- Book
- Clipping text
- Location in the book
- Date
