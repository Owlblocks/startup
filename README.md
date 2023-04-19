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

With the service, a lot has been added. Gifs and avatars can be uploaded, accounts can be created, other users can be followed ("friended") and you can favorite your gifs (which existed in the javascript version, but now these gifs are actually linked to a profile).

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

Simon Login:
- I feel like I remember a token being generated each login session when working with an API before. Am I remembering that wrong? If that's common, what are the costs of having a per-token user? Does it essentially act as a password that can be stored entirely and passed around without endangering the user's passwords on different sites?
- I learned a bit how cookies work.
- I figured out that I need to decide whether my Startup service will have a single Users collection, with account info and user info, or if I should separate a user's favorites and uploaded gifs (not the gifs themselves) from their password hash and token.

Startup:
- Authentication is incredibly confusing, although very important.
- Passwords should always be hashed when stored (I knew this before, but it never hurts to be reminded of this one)
- Both GET and POST can have arguments in their urls, but only POST can have a body in the request.
- MongoDB can be searched using regex rather than an entire string
- MongoDB can be updated using updateOne, with special arguments for operations like setting a field, or adding to a list field
- websockets allow the server to reach out to the client
