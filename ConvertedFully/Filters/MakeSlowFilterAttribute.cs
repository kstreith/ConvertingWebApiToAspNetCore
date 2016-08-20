using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ChoreApp.Filters
{
    public class MakeSlowFilterAttribute : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            var headers = context.HttpContext.Request.Headers;
            if (headers.ContainsKey("tri-delay"))
            {
                //var test = headers["tri-delay"];
                var value = headers["tri-delay"].FirstOrDefault();
                int delay = 0;
                if (Int32.TryParse(value, out delay))
                {
                    Thread.Sleep(delay * 1000);
                    //await Task.Delay(delay * 1000);
                }
            }
        }
        public void OnActionExecuted(ActionExecutedContext context) {            
        }
    }
}