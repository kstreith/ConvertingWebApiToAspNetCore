# ConvertingWebApiToAspNetCore

This is sample code for a presentation on converting a Web application from ASP.NET 4.x to ASP.Net Core. The original web app is in the OriginalWebApi/ folder. It is a simple chore tracking application. It uses static HTML and JS (e.g. it does not use MVC). It does however use WebAPI 2.X. The back-end uses an in-memory persistence and will attempt to persist .json files to the App_Data/ folder to enable persistence to be maintained between application restarts.

The application was converted to ASP.Net Core and .NET Core, 2 different ways. The first is using the WebApiCompatShim library, the result of that is in the ConvertedUsingShim/ folder. The second is converted completely to ASP.Net Core without using the shim library, the result of that is in the ConvertedFully/ folder.

Feel free to using a directory diffing tool such as KDiff3 or Beyond Compare to diff the directories to see what changes were made.

### Associated Presentation

There is a presentation that walks through the conversion process, specificially detailing the steps and why changes were required.

[http://itsnull.com/presentations/moveToCore/](http://itsnull.com/presentations/moveToCore/)

## Original Application

The OriginalWebApi/ contains the original ASP.NET 4.x application. You should be able to open and run it in VS 2013 or later.

## Converted to ASP.Net Core using WebApiCompatShim

The ConvertedUsingShim/ contains the application once converted to use ASP.Net Core 1.0.0 and .NET Core. You should be able to open and run it on Windows using VS 2015 Update 3 or later.

On Windows, Linux or Mac OS X, you should be able to open it and run it using VS Code. Or on any of those platforms, once you install the dotnet runtime, you should be able to run the application by doing.

    dotnet restore
    dotnet run

and then navigating to http://localhost:5000/

## Converted to ASP.Net Core

The ConvertedFully/ contains the application once converted to use ASP.Net Core 1.0.0 and .NET Core. You should be able to open and run it on Windows using VS 2015 Update 3 or later.

On Windows, Linux or Mac OS X, you should be able to open it and run it using VS Code. Or on any of those platforms, once you install the dotnet runtime, you should be able to run the application by doing.

    dotnet restore
    dotnet run

and then navigating to http://localhost:5000/
