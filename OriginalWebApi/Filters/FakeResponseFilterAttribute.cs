using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ChoreApp.Filters
{
    public class FakeResponseFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext context) {
            var headers = context.Request.Headers;
            if (headers.Contains("tri-statusCode"))
            {
                var value = headers.GetValues("tri-statusCode").FirstOrDefault();
                int statusCode = 0;
                if (Int32.TryParse(value, out statusCode))
                {
                    context.Response = new HttpResponseMessage((HttpStatusCode)statusCode);
                }
            }
        }
    }
}