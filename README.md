# GitUncovered: Github Repositories Listing Page
This project is a web app that displays the public Github repositories belonging to any specific user. It uses the Github REST API to fetch the data and Bootstrap and Jquery for the UI. It has the following features:

- Server-side pagination: The user can choose how many repositories to show per page, from 10 to 100, using a slider. The app will make API calls accordingly and show the results in a table.
- Search functionality: The user can search for a specific repository by name or description using a search bar. The app will filter the results based on the query.
- Topics display: The app will show the topics associated with each repository as badges below the repository name.
- Loader animation: The app will show a loading spinner while the API calls are in progress.
- Page status preservation: The app will save the current page number, page size, and search query in the local storage, so that the user can stay on the same page even on reload.
- It is a responsive design, the website is compatible with different screen sizes and devices.
  
### Getting Started
Simply clone this repository to your local machine using 
`git clone https://github.com/your-username/your-repo-name.git`
Navigate to the project folder using
`cd your-repo-name`
- Open the index.html file in your browser. You can do this by double-clicking the file or by typing
- `file:///path/to/your-repo-name/index.html` in the browser's address bar, where `path/to/your-repo-name` is the actual path to your project folder.

### Assumptions
Some of the assumptions I made while working on this project are:

-The user will enter a valid Github username in the search bar. If the username is invalid or not found, the app will show an error message.
-The user will not enter any special characters or spaces in the search bar. The app will ignore them if they do.
-The user will have a stable internet connection and will not cancel the API calls. The app will handle any network errors gracefully.

### Challenges
Some of the challenges I faced while working on this project are:

-Implementing server-side pagination with the Github API, which has a limit of 100 items per page and requires specifying the page number and per_page parameters in the request.
-Displaying the topics of each repository, which are not included in the default response of the API and require making a separate request for each repository.
-Preserving the page status in the local storage, which involves saving and retrieving the relevant data and updating the UI accordingly.

### Future Improvements
Some of the future improvements or features I would like to add to this project are:

-Adding a sort functionality to sort the repositories by name, date, size, stars, forks, etc.
-Adding a filter functionality to filter the repositories by language, license, visibility, etc.
