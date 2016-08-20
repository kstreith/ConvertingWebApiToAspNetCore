# ChoreApp

This is the code for the [TRINUG](http://www.meetup.com/trinug/) Web SIG on building a modern web app. This is a very simple chore tracking application for tracking chores by children. This will be built over a series of sessions. This application very intentionally does not use any existing web application framework (Angular, React, Ember, Knockout, Aurelia, etc.) so that we can discuss what happens directly in the browser. This is not an endorsement of writing your own framework from scratch, just simply a teaching tool. Please use this code to learn about how to do things manually, e.g. what frameworks are doing for you. I'm not suggesting you should write your own framework for something you plan on putting into production.

You can download code for both the beginning and end of a given session. See the releases page for the project at https://github.com/kstreith/ChoreApp/releases or git clone the project and checkout the appropriate tag.

1. [Session 1](http://www.meetup.com/TRINUG/events/230018101/) - The purpose of this session is simply to write rendering code to generate a table given a javascript array of data. You can open the index.html directly in a browser (IE9+, Chrome and Firefox) have been tested. If you look at the choreMain.js, you can uncomment the examples, marked as EX-1, EX-2, etc. to see different techniques for rendering the user grid at the top of the page. The goal in this session is then to write code to render the bottom two grids on the page. At the end of the session I show a simple templating language, that is the EX-5 sample. The code for the template engine is in choreUtil.js. In case you are curious, it does appear we are making AJAX calls to a back-end using JQuery. However, you'll notice we never started up a back-end. If you look into mockServerData.js, you'll see I've mocked out a back-end in JS that runs entirely in the browser.
  * Start
    * Either git checkout session1-start
    * Or download the session1-start release zip at https://github.com/kstreith/ChoreApp/releases/tag/session1-start
  * End - This code uses the template engine to render all three grids. It also uses requestAnimationFrame to redraw all three grids every time the browser redraws a frame. If you want to see the desired end result as you write code from the starter template, this will show you the desired result.
    * Either git checkout session1-end
    * Or download the session1-end release zip at https://github.com/kstreith/ChoreApp/releases/tag/session1-end
2. [Session 2](http://www.meetup.com/TRINUG/events/230569765/) - This session requires VS 2013 or VS 2015.
    * Start
      * Either git checkout session2-start
      * Or download the session2-start release zip at https://github.com/kstreith/ChoreApp/releases/tag/session2-start
3. [Session 3](http://www.meetup.com/TRINUG/events/230571332/) - This session requires VS 2013 or VS 2015.
    * Start
      * Either git checkout session3-start
      * Or download the session3-start release zip at https://github.com/kstreith/ChoreApp/releases/tag/session3-start
3. [Session 4](http://www.meetup.com/TRINUG/events/232882303/) - This session requires VS 2013 or VS 2015.
    * Start
      * Either git checkout session4-start
      * Or download the session4-start release zip at https://github.com/kstreith/ChoreApp/releases/tag/session4-start
