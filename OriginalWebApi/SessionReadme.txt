Session 4
----------

In this session, we will be working on:

1) Two-way data binding
2) Fixes I made to address server slowness
3) Fixes I made to address server failures
4) Enabling child selection in assignment grid
5) Connecting the chore and assignment grid
6) Client-side validation using two-way binding framework
7) Client-side validation independently of the framework
8) Only showing assignments grid by default

Starting application and back-end details
------------------------------------------
The application now has a working back-end api written in WebAPI. You will
need Visual Studio 2013 or Visual Studio 2015 to run the WebAPI back-end.
The previous web application from session 1 was simply copied into the
same directory as the new WebAPI project. The front-end is still simple static
html and javascript, the front-end does NOT utilize or require MVC to work.
The static html and javascript from session 1 is simply served by IIS express
by being in the same directory as the WebAPI project.

The back-end does NOT require a database, it stores the data for the chore
application in-memory as C# List's and Dictionary's. It also writes the data
to the disk as *.json files in the App_Data\ folder. When ever the WebAPI
back-end is restarted it will attempt to find the most recent *.json file in
the App_Data\ folder and parse that as the initial in-memory data. If there
aren't any files in the App_Data\ folder, it will simply initialize with some
hard-coded data.

So, the back-end will behave as though it is a database without actually
requiring one. If you want to reset the data, simply delete all the files in
the App_Data\ folder and then restart the WebAPI project.

There are a couple things the WebAPI will prevent:

1) The API prevents deleting a user that has chores, you must first delete
all associated chores before you can delete a user.
2) You cannot edit the assigned user of an existing chore.
3) The API is aware of the current date-time, depending on the day of the
week that you run the application will change with rows in the bottom grid
are shown in red to indicate that a chore is overdue.

1 - Two-way data binding
------------------------
In sessions 1 and 2, we are always calling a method to force a re-render
of a grid or display of a modal. That kind of pattern is still being used
in choresView.js and thisWeekView.js. Those classes still make calls to
chore.executeTemplate and chore.showModal or chore.showModalWindow. If you
write a web application using Ember, Angular, Knockout, Aurelia you won't
really see that kind of code. Renders just happen automatically as needed. How
does that work?

I've written a very simple two-way data binding. It's a JS class called
chore.TwoWayBindingModel, it's in twoWayDataBinding.js. If you want to play
with, try the following in the developer console:

  m = new chore.TwoWayBindingModel();
  //now add a property, to the model called .testProp, giving it an initial
  //value of 2
  m.addProperty('testProp', 2);
  //query the property
  m.getPropertyValue('testProp');
  //update the property
  m.setPropertyValue('testProp', 5);
  //query the property
  m.getPropertyValue('testProp');
  //you can subscribe to a property using the .subscribe method
  m.subscribe('testProp', function () { console.log('--testProp is now ' + m.getProperty('testProp')); });
  //update the property and see message
  m.setPropertyValue('testProp', 10);
  //the subscription is only called if the value changes
  //you can also query properties directly
  m.testProp;
  //and update the propery using the .setPropertValue method
  m.testProp = 20;
  //in fact, when you use .testProp and .testProp = 20, they are simply
  //calling .getPropertyValue and .setPropertyValue underneath. This
  //uses a feature of ES5 (supported in IE9 and later) that is very
  //similiar to C# properties. They look like properties, but actually
  //call registered getter and setter functions.

You could read all of the source code in twoWayDataBinding.js to see how
this is implemented, but it basically uses a hidden object to get/set the
actual values and then maintains a dictionary to keep a list of subscribers
for each property. The set function then does a comparison between the new
value and existing value. If they are different, it looks for any subscribers
for that property and then calls their registered callbacks. Now, this class
doesn't anything for the DOM. So, how does the automatic re-render occur?

In sessions 1 and 2, we created and then updated chore.executeTemplate. In
this session, I've made some additional modifications. On the viewModel, I
check to see if there is a .subscribe function, e.g. we have a two-way model.
If there is, the .executeTemplate then uses that to register a callback when
that value changes in the model. In the callback, it then does the proper
steps to update the DOM.

And that is how two-way data binding can be made to work. This is similiar
to how Knockout and Ember work. Those frameworks use a bunch of extra tricks,
such as not making DOM changes immediately but batching them up using a
micro-task system. The method I showed is basically a notification system,
when there is a change, send out a notification. This is also similiar to
how WPF and XAML work in .NET, using the INotifyPropertyChanged interface.

Another model is a polling or dirty-checking model. In this case, at some
interval the framework captures the state of your data and then compares to
the previous state of your data. It then figures out precisely which fields
have changed as part of doing this comparison. It then notifies any subscribers
that are interested in those changes. This is what Angular uses. I believe
Aurelia actually provides both methods mentioned above and picks the
appropriate one.

If you look at usersView.js, you'll notice it never calls
chore.executeTemplate. It simply sets the .users array and via the
two-way data binding and the .subscribe call in chore.executeTemplate
it simply knows to re-render the loop template when the property of the
view model changes.

I converted usersView.js over completely to use two-way data binding and
subclass the chore.TwoWayBindingModel class. I want to point that only the
tri- attributes that I needed to get usersView.js working are the ones
I fixed in chore.executeTemplate. If you try and convert the entire app over
to use two-way data binding, you will need to add code to chore.executeTemplate
and probably make other changes as well.

Why do some frameworks consider two-way data binding bad?
---------------------------------------------------------
Let's first talk about the two-ways, so we know what that means.

One-way is when you update the JS, the DOM updates. So, if you set
the .users array, the grid will update with the new data.

Another way is when you trigger an event, the JS updates. So, if you enter
text into a textbox or select a value in a dropdown or click a button,
eventually something updates or is called in your JS.

If you think about building an application, you need both of those things
to happen in order to build any moderately large application. So, when
frameworks say they two-way data binding is bad, what do they mean?

I haven't seen an article yet that really explains what the problem is, so
let me make a guess here. I believe it's two things that they are worried
about, performance and maintainability.

A framework can easily end up attaching a bunch of event handlers to a bunch
of elements in a moderately large application. A framework can also end up
monitoring or subscribing to a large amount of JS object/properties in a
moderately large application. So, I think frameworks are considering that and
trying to make some of those things more opt-in as opposed to opt-opt. The goal
being better performance by default because less things are being automatically
tracked and updated.

The other concern I think they have in maintainability. All of the frameworks
have some way to watch or subscribe for JS changes, e.g. similiar to my
.subscribe method. This feature can be abused as a way to have components
communicate with each other in subtle and non-obvious ways. Think of code
similar to this:

file1.js
--------
  .Employees = [];
  .FirstName.subscribe - //update .FullName using .FirstName + .LastName
  .LastName.subscribe - //update .FullName using .FirstName + .LastName
file2.js
--------
  .Employees.subscribe - //update .Message depending on at least one employee
file3.js
--------
  .Employees.subscribe - //update .LastAdded employee depending on array
file4.js
--------
  .LastAdded.subscribe - //update .LastAddedMessage depending on whether we
                           have .LastAdded or not
Now image all of those properties are displayed in HTML at least once, maybe
more than once. Now image what happens in a dialog that edits a record in
the .Employees array. Which properties update? What path updates them? What
about add instead of edit? Delete instead of edit? Now image we have a much
larger application, e.g. twenty-screens with 100+ JS files. If all of your
components are coordinating this way, a .FirstName might not do anything
or it might update 20+ properties and re-render 20+ DOM elements. There isn't
an easy well to tell which assignment statements have no side-effects vs. which
have a lot of side-effects. I don't recommend using this pattern in your
application to coordinate between components, something more obvious should be
used, maybe .notify('MessageType', 'Value'). Now you can tell the difference
between .FirstName = and .notify. If the .subscribe feature is abused, you can
end up with a hard to reason about, hard to debug app. For this reason along
with performance, I think frameworks are trying to make you work a little bit 
harder and think before you start using their .subscribe mechanisms to wire
things together. This hopefully results in easier to maintain code that is
easier to reason about.

For those that have been programming awhile, I think this is earily similiar
to the goto statement debates and debates about whether to have multiple
return statements in a function. Any programming mechanism can be sufficiently
abused if you aren't sufficiently disciplined, let's share war stories later.


2 - Fixes I made to address server slowness
-------------------------------------------

In the last session we talked about the problems that can occur when you
don't plan for and address server slowness. For more details on that and
ways to simulate server slowness, please refer back to that session. I'll
go through the fixes I made to each grid to deal with the problem.

Children Grid - e.g. usersView.js
---------------------------------
This is using two-way data binding, I created a variable called
.showBlockUserModal. This displays a modal with a spinner and no buttons.
I then updated the code for add/edit/delete to display the modal, e.g.
setting that value to true before we start the ajax call to the server.
Once we receive a response from the server, I set it back to false which
will hide the modal. This modal prevents the user from doing anything on the
page while we wait for a response from the server. I would point out that
previously I only had a callback for a successful response from the server
(e.g. HTTP status code of 2XX). If there was an error the modal would still
have been displayed preventing the user from doing anything on the page.
I added a failure callback using .fail on the JQuery Deferred and also hide
the modal in that case as well.

Chores Grid - e.g. choresView.js
--------------------------------
This doesn't use the two-way data binding. Here I followed a similiar pattern
of display a modal with a spinner. In this case, I had to use
chore.showModal($("#waitModal")); to show the modal and then use
chore.hideModal($("#waitModal")); to hide the modal. Again, I added code
around add/edit/delete to display the modal while waiting on a response from
the server.

Assignments Grid - e.g. thisWeekView.js
---------------------------------------
This grid only completes or clears chores when you click on the completed
column. It looks at the current state of the row and then calls the
appopriate server-side api, either /api/chores/clear or /api/chores/complete.
So, if you click again while waiting on a response from the server you will
generate the exact same request to the server and you will change the
underlying data in exactly the same data, e.g. you complete a chore more than
once if you click more than once and that is perfectly reasonable. For this
reason, e.g. the way the ui and api work, there isn't any need to prevent
user action while waiting on the server. So, no changes were made to this grid.

3 - Fixes I made to address server failures
-------------------------------------------
I split server failures into two groups, expected failures and unexpected
failures.

For unexpected failures, e.g. the server had an uncaught exception, we
will receive a 500 error according to the default behavior of WebAPI.
Remember in the previous session, we are no longer using $.ajax directly,
the entire app uses chore.ajax which allows us to centralize some of our
error handling. In this method, I added a failure callback. Within that
callback, I check and ignore an abort failure. An abort failure occurs
when the page is closed or when the page is navigated to another page, in
that case any unfinished ajax requests are aborted by the browser. I also
checked the status code of the error and only if it's a 500 error do I
do anything. In that case, I display a generic error message using the
utility method we built last session, chore.showErrorMessage.

We have a few expected errors from our api, listed below:
  1) DELETE /api/users/[id] - returns a 409 if user has assigned chores
  2) PUT and POST /api/users - returns a 400 if user has no name
     or name is only whitespace.
  3) PUT and POST /api/chores - returns a 400 if chore has no description
     or description is only whitespace. Also returns a 400 if chore
	 doesn't have at least one assigned day.

For these cases, I put code specifically into the failure callbacks where
we call those apis. In the failure callback, I then checked for the specific
status code and then display an appropriate end-user error message for
that scenario using chore.showErrorMessage. Notice that for 2) and 3)
above that is server-side validation that is occuring. Later, I'll talk
about code I added to do that same validation client-side for a better
user experience.

4 - Enabling child selection in assignment grid
-----------------------------------------------
In the previous session for the assignment grid, we had added a
dropdown so that users could select the child they wanted to view
the assignments of. However, in the previous session it didn't work
yet.

The grid, e.g. thisWeekView.js keeps track of the currently selected user
id, using the .selectedUserId property. I made adjustments to default this
value to null in the constructor and then updated the .fetch method to only
make a request to server if the value is non-null, otherwise it simply
sets the array of assignments to an empty array. I then had to add event
handling code to know when the user changes the selection in the dropdown and
then locate the id of the selected item and update the .selectedUserId
property and then load the updated chore assignments from the server.
That was done with some pretty simple JQuery code, shown below:
    $("#thisWeekUserSelection").on("change", function () {
      self.selectedUserId = String($("#thisWeekUserSelection").val());
      self.fetch();
    });

The most difficult change had to do with getting the list of users and
dealing with the list of users changing. If you remember from the last
session, the assignments grid doesn't know how to get the list of users, the
users are passed into the .setUsers method. More specifically, this .setUsers
method might never be called or might be called more than once with a different
set of users each time. Specifically, if you edit the users grid at the top
of the page, eventually .setUsers will be called with the updated users list.
So, this method must capture the existing .selectedUserId which could be null
or could be the id of a user that is currently selected in the dropdown.
Then, we must see if the user still exists in the new list of users. If so, we
want to preserve that id in the .selectedUserId. If the user no longer exists
or if we never had a selected user to begin with, then we should select the
first user from the new list of users that we have, if we have any. Once that
is done, we must re-render the dropdown and once it has been re-rendered we
must select the value in the dropdown corresponding to .selectedUserId. And
then of course we must fetch the associated assignments for that user from the
server.

This flow is fairly typical when dealing with dropdowns or related controls,
some frameworks assist with this partially and some don't provide any
assistance. To summarize:
  1) What is the currently selected item when you don't have any options yet?
  2) When the set of options changes...
      2.1) What happens to the prior selection? Is it preserved?
	  2.2) Do you attempt to pick a default selection? If so, which one? And when?

5 - Connecting the chore and assignment grid
----------------------------------
In the last session, we separated all the grids into individual components and
I showed the need to connect the users grid to the other grids. When a change
is made in the users grid, both the chores and assignments grid need to be
updated. I showed a pattern of adding a callback to the users grid and then
a .setUsers method to both the chores and assignments grid. In choreMain.js
I then showed one-way to wire it up so that any changes from the users grid
were propagated to the other two grids using the .setUsers method.

For that session though, changes in the chores grid still need to cause
updates in the assignments grid. I originally considered following the
exact same pattern, which is passing the new list of chores to a
callback and then passing that list to the assignments grid via
a setChores method. However, in this case the assignments grid can't
really do anything useful with the list of chores, that wasn't the case
for the other scenario.

What the assignments grid really wants is the id of the user that had their
chores updated. If it's the same user that we are viewing the assignments of,
then we need to update from the server. If it's a different user than we are
viewing the assignments of, we don't need to do anything. So, that's the
change I implemented, look at choresView.js for choresUpdatedCallback and
thisWeekView.js for choresUpdated method and then look at choreMain.js to
see where everything is wired up.

6 - Client-side validation using two-way binding framework
----------------------------------------------------------
Previously in section 3, I talked about handling server errors, a few of
which were really server side validation errors. While that implementation
does prevent the user from submitting bad data, it's not a great user
experience. So, we'd like to add client-side validation. The users
grid uses our custom two-way data binding framework and that's the first
grid I'd like to add validation to.

I have some partial code in usersView.js and most of the validation code
is commented out. So, first let's test the server-side validation and
see the user experience. Try to add or edit an user with either no name
or a name with only whitespace. You'll see an error message but it's not
very helpful or informative.

Now, let's enable client-side validation. I've added a property called
showUserNameValidationError that is either true or false. I've also added
an <span> tag with a tri-show in the index.html that contains the error
message that will be shown or hidden. I've also added a .validate method that
would perform all the validation for the form and then a specific
.validateUserName method that checks the value the user has entered to see if
it is empty or only contains whitespace and then sets the
.showUserNameValidationError property to show or hide the error message to the
user. 

So, all we need to do is check validation and then prevent saving if we don't
validate. So, go ahead and uncomment //VALIDATION-1 in the usersViews.js, e.g.
in the .addEditModalOkClick method. This will call our .validate method
which checks and will show the error message. If it returns false, we
immediately exit, e.g. we won't talk to the server or close the dialog. Try
and see how it works. You'll notice it's a better experience but still not
great. The message stays even if you've fixed the problem, you only know
you fixed it because the dialog closed and your add/edit worked.

Let's add some code to run the validation whenever the name changes, uncomment
//VALIDATION-2 in the usersView.js, e.g. in the constructor. This subscribes
to changes to the name and then re-runs the validation whenever that happens
which will show/hide the messsage as appropriate. Now try and see what you
think. Now, you'll notice that you see the message as soon as bring up the
dialog. The reason for that is when you bring the dialog up, the name is in
fact empty which is NOT valid. Maybe that's good or bad depending on your UX
preferences, but you should notice that the message will show/hide when you
lose focus on the text box. Why is that? That is because we are using our
custom two-way data binding framework and we are using tri-value property.
If you look in choreUtils.js you will see that it registers an event handler
for the 'blur' event, e.g. when the text box loses focus. At that point it
updates the JS value which is what calls our subscribe method.
This is something you'll run into when try to implement some things using
two-way data binding frameworks, they setup the event handlers for you which
is good, but they may not setup the event handlers you really wish they did.
In the next section, we'll talk about doing validation independently of a
binding framework you might be using.

Having the message show up before the user has typed anything could be 
considered hostile. Let's fix that, uncomment //VALIDATION-3, that hides
the error message that is showing because validation has failed. It's fine
to do this, because when you click the "Ok" button we will re-run validation.
Now, if you try this it should be a pretty good experience except for the fact
that you have to lose focus on the text box before the validation error
disappears.

7 - Client-side validation independently of the framework
---------------------------------------------------------
We have one more form that requires client-side validation and that is the
add/edit chore dialog. We need to check that the Description is not empty
or whitespace and we have to check that at least one day is selected.
For this example, I want to write a independent validation library that just
handles validation. This library is then able to attach the appopriate events
to the appropriate elements to provide a very dynamic validation experience.
Validation is not bound to the way a binding framework works. I think that's
important because the entire point of client-side validation is to provide
a better UX experience than simply an error message summary that comes back
from server-side validation.

I've put this library in choreValidation.js. You annotate your elements with
val-* attributes. I've written three attributes.
  val-required - this element will be required.
  val-nowhitespace - this element must have a non-whitespace value
                     if a value is provided.
  val-atleastone - this groups checkbox elements together, at least one
                   item in the group must be selected.
In order to enable validation, you must call chore.validate passing
a JQuery element, it returns an object with a .validate method. In order to
run validation you must call the .validate method. It will then return
true or false and display any appropriate error messages. It also takes
care of registering for events and re-running validation dynamically as
appropriate.

It has two modes, start mode and then validation mode:
  1) In start mode, nothing is validated and no events are attached.
  2) Once .validate is called the first time, it validates all the
	 elements and also attaches events. It then re-runs validation as those
	 events fire and shows/hides error messages as appropriate.

Try it out with chores and then we can talk about the code behind it and
changes you could make. You'll notice you can type empty spaces into
Description and you don't see an error message. Once you click "Ok" you will
see the error message. As soon as you type into Description, you'll see
messages show/hide as appropriate even the required message if you empty
out the field. No need to lose focus on the field to get updates.

There is a bug in both the required and nowhitespace validators. Try using
the right-click menu to perform the cut/copy/paste actions. You'll notice
validation is never re-run properly. If look in both validators, you'll see
they only attach to the keyup event. Using the right-click menu for
cut/copy/paste won't trigger the keyup event, so validation isn't re-run.
The browser specifically has 'cut', 'copy' and 'paste' events for these
right-click menus. Try adding code for those events that re-runs the
validation. Keep in mind you do need the .off to detach the events as well.
The .off is there because every time we bring up the dialog, we want to 
re-initialize validation which means removing any attached event handlers.
We use the event.[namespace] syntax support by JQuery to be sure that
we are only removing event handlers that we added.

The pros of having this validation framework separate is that it can attach
to as many of these events as needed, e.g. maybe touch events for mobile, 
without having any effect on your general binding framework. Having said
that, validation is hard to get right, you need multiple event handlers
different states for when you do and don't run validation, it's worth using a
pre-existing library to perform validation.

8 - Only showing assignments grid by default
--------------------------------------------
You can use the buttons at the top of the page to show/hide the various grids.
The code for those buttons is in choreNav.js. It initializes the buttons
based upon which sections are visible by default when the page is loaded.

For example, you can find the <div id="userPanel"> in index.html and add
style="display: none" to hide it by default. You'll notice that the children
grid is now hidden and the button is automatically toggled to off.

Feel free to make the same change for the chores grid, e.g. id="chorePanel".
If you want you could also use HTML5 localStorage, localStorage.getItem(key)
and localStorage.setItem(key, stringValue) to store the current state of the
grids between page loads, that way the page starts back however it was the
last time the user left the page. Simply update choreNav.js to use
localStorage methods as appropriate.

Final Thoughts
--------------
The application at this point is feature complete. You can use this
application as a testing ground for other things. Some potential ideas:

1) Convert all JS to use ES6, specifically classes and => functions.
2) Convert to use Typescript
3) Convert to use a framework, e.g. Angular, Ember, React, Aurelia
4) Convert to use a CSS framework, e.g. Bootstrap, Foundation
5) Experiment with different ways of handling server slowness or
server failures.
6) Make it work offline
7) Convert the WebAPI back-end to use ASP.Net Core.
8) The grids and navigation will work on mobile currently, but the experience
could be improved.
