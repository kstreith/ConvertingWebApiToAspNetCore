Create new ASP.Net Core Web Api project in VS, using .NET Core only
Open in VS Code

Brought over code-base from previous project
throw new HttpResponseException() <-- not found
ApiController <-- not found

Add "Microsoft.AspNetCore.Mvc.WebApiCompatShim": "1.0.0" to project.json
In Startup.cs
In ConfigureServices
            var mvc = services.AddMvc();
            //KIP - need to store result of .AddMvc, then need to call .AddWebApiConventions
            //KIP - need to update project.json to add reference to WebApiCompatShim
            mvc.AddWebApiConventions();
In Configure
            //KIP - Need the .MapWebApiRoute
            app.UseMvc(options => options.MapWebApiRoute("DefaultApi", "api/{controller}/{id?}"));            
Now, only thing that doesn't work is HostingEnvironment.MapPath("/App_Data/"); to get location of App_Data folder
Have to change to get IHostingEnvironment via built-in dependency injection
    Change ChoreRepository to register via dependency injection, remove .Instance() method, make constructor public
    In Startup.cs
        services.AddSingleton<ChoreRepository, ChoreRepository>();
    Have to modify controllers to get ChoreRepository via dependency injection, add constructor argument
    Have to modify constructor of ChoreRepository to take IHostingEnvironment as constructor argument
    Can now update pre-existing code from HostingEnvironment.MapPath("/App_Data/") to:
        HostingEnv.ContentRootFileProvider.GetFileInfo("/App_Data").PhysicalPath;
    Still doesn't work initially, unless user creates App_Data folder, default template doesn't have folder.

Add using Microsoft.AspNetCore.Mvc; to controller files
Api now appears to be working, only tested two apis - get users, add a user, everything else just compiles, no testing.

Let's put UI on top - previous UI didn't use any MVC
    css/, fonts/, images/, scripts/, index.html - put in same path (e.g. where .xproj is, nothing happens)
    put into wwwroot, still nothing happens
    Add "Microsoft.AspNetCore.StaticFiles" to project.json
    Add app.UseStaticFiles(); to Configure method
    Still doesn't appear to work
    Accessing full url does work, http://localhost:5000/index.html
    Add app.UseDefaultFiles(); to Configure method, must come before .UseStaticFiles();
    Now going to http://localhost:5000/ does work correctly

UI is showing proper numbers of rows, but fields are all empty???
This is because the new web api changes the default casing of fields, previously .FirstName, .LastName, now .firstName, .lastName.
Either update all client-side code or just write new client-side code
OR, change casing back to what is was, update ConfigureServices in Startup.cs
            var mvc = services.AddMvc();
            mvc.AddJsonOptions(opt => {
                var resolver  = opt.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    var res = resolver as DefaultContractResolver;
                    res.NamingStrategy = null;  // <<!-- this removes the camelcasing
                }
            });
Now, appears to be working. Test application, everything is working except completing, clearing chores
    /api/chores/complete
    /api/chores/clear
In network tab of browser, we get a 415 Unsupported Media Type
Previously, it worked, now either I have to change client code:
    $.ajax({url: '', type: 'POST', data: {}} 
    to:
    $.ajax({url: '', type: 'POST', data: JSON.stringify({}), contentType: 'application/json'})
OR, I have to change server code:
    public void Complete(CompleteChorePayload value)
to:
    public void Complete([FromForm]CompleteChorePayload value)
See this article for more details: http://andrewlock.net/model-binding-json-posts-in-asp-net-core/
Now, everything works except for my two special filters.

--Get filters working
    had to re-write filters, see https://docs.asp.net/en/latest/mvc/controllers/filters.html
    show before/after
    had to register filters in Startup.cs
            var mvc = services.AddMvc(opt => {
                opt.Filters.Add(new FakeResponseFilterAttribute());
                opt.Filters.Add(new MakeSlowFilterAttribute());
            });        

--Talk about how this uses the shim
--Does this work on Linux?
--How do we convert this so that we don't use shim?

--Currently, no nice error pages, if we add does api still return good error messages?

