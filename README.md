# startup
CS 260 Web Programming Project.
------------------------
IP: 3.18.32.241
---------------------
Baobab (baobab-gifs.click)

Baobab is a website for hosting GIFs. It's similar to Giphy, but with a focus on sharing GIFs with friends rather than uploading them for strangers.
Features:
- Upload GIFs to the website
- Add friends
- View your own GIFs and your friends'
- Pin certain friends' pages to your hotbar
- Favorite GIFs to your favorites page
![mockup](ninjamock.png)

Notes:
Simon HTML:
- A lot of what I learned concerned the basics of how svg images work. By the time I typed out the code, I understood, basically, what the vectors meant

Simon CSS:
- With the Bootstrap framework, so much of what I had to change was in the HTML. A lot more than I'd anticipated.

Simon Javascript:
- localStorage is per-browser; switching from firefox to chrome reset the scores
- sound usage is fairly simple in javascript
- you can link js objects to elements through a dictionary structure

Simon Service:
- I learned primarily just how simple the basics of a service is when you're relying on JSON and node.js. So much of what I did in CS 240 with services relied on creating Java classes for the different endpoints. I'm sure a project like that would be more elaborate than this basic Simon service, but it still blows me away just how simple this is (to the point that I'm not sure what else I learned that isn't just a single line of code).
- In terms of single lines of code, making sure to serve the primary content of your website statically is important to remember.

Simon DB:
- I learned to be wary of my apartments Wifi, as it became slow to the point of nonfunction while I was bugtesting my MongoDB access 10 minutes before the deadline
- I learned that MongoDB needed to be updated to accept any IP address
- I learned how MongoDB has both databases and collections to organize data