# MoviesFacebookBot
You can ask it to give details about some movie, and it will show short plot summary of that movie. If that movie is not found, it will ask user to enter another movie name. At the backend, it calls an open API, "http://www.omdbapi.com", which is an open movie database, to extract details of the movie. We then parse the json and send "plot" to the users.
