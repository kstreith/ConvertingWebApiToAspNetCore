using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ChoreApp.Filters
{
    public class FakeResponseFilterAttribute : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context) {
            var headers = context.HttpContext.Request.Headers;
            if (headers.ContainsKey("tri-statusCode"))
            {
                var value = headers["tri-statusCode"].FirstOrDefault();
                int statusCode = 0;
                if (Int32.TryParse(value, out statusCode))
                {
                    context.Result = new StatusCodeResult(statusCode);
                    //context.HttpContext.Response = new HttpResponseMessage((HttpStatusCode)statusCode);
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) {            
        }        
    }
}