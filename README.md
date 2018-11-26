# GameOfGit
A Chrome extension implementation of Conway's Game of Life, using GitHub's contribution activity graph.

Instructions:
- Navigate to a GitHub profile, such as https://github.com/williamlu2015.
- Click the GameOfGit icon to the right of the Chrome address bar. The icon should turn from white to black and there should be a 52x52 grid in place of the contribution history on the page.
- Click cells to toggle them and create your starting pattern.
- Click the GameOfGit icon again. The icon should turn to an Octocat. The game should start running at the number of ticks (generations) per second specified in the options (default is 10.)

For this extension to work properly, you must install libraries.
* Download the following stylesheets and save them into the "lib" directory:
    * https://necolas.github.io/normalize.css/8.0.0/normalize.css
    * https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css
* Download the following scripts and save them into the "lib" directory:
    * https://code.jquery.com/jquery-3.3.1.slim.min.js
    * https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js
    * https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js
