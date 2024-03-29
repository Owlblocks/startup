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

Simon WebSocket:
- web sockets require code in both the client and server, as it's a two-way package.
- Apparently, while a web socket server requires a node package, the WebSocket class itself is accessible without any imports, as it was used in play.js out of the box. Apparently the api itself is important enough that Javascript comes packaged with it.
- Most of the websocket creation-type code happens at the server level, and then the use is at the client level.

Simon React:
- Due to Node's library functions, it seems developing with Bootstrap is easier with React, as there are actual libraries and functions to look at, but that might just be because VSCode gives more insight into javascript libraries than it does with CSS frameworks (if it's able to give insights into the latter at all).
- It seems that some of React's modularity, specifically the elimination of redundant code through a single HTML page, could be mimicked by populating a single HTML page dynamically using Javascript and the DOM. I assume this basically does that, but more automatically and conveniently.
- Overall, using classes (functions) to create modular components is much more intuitive to my brain than regular HTML and Javascript. I'm not sure if that's due to my programming experience, or just native intuition.
- This is more of a sidenote, but I once followed along a guided programming project that used klass to name a class and avoid a keyword rather than something like className. Granted, the former wouldn't be properly described by "className" but klass could also be confusing to those that weren't following along.
- React would have probably simplified my startup's solution for requiring authentication to do anything. I had to redirect any page to the login screen if not authenticated, rather than not displaying them in the first place unless you logged in.
- using && short-circuiting for hiding components (I think that's what you're doing) is a bit confusing, although it really helped to understand subconsciously what JSX files are being read as.
- Overall, the structure of the application feels more familiar as a programmer

Startup:
- Authentication is incredibly confusing, although very important.
- Passwords should always be hashed when stored (I knew this before, but it never hurts to be reminded of this one)
- Both GET and POST can have arguments in their urls, but only POST can have a body in the request.
- MongoDB can be searched using regex rather than an entire string
- MongoDB can be updated using updateOne, with special arguments for operations like setting a field, or adding to a list field
- websockets allow the server to reach out to the client
