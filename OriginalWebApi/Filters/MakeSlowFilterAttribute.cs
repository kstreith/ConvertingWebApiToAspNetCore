using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ChoreApp.Filters
{
    public class MakeSlowFilterAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutingAsync(HttpActionContext context, CancellationToken cancellationToken)
        {
            var headers = context.Request.Headers;
            if (headers.Contains("tri-delay"))
            {
                var value = headers.GetValues("tri-delay").FirstOrDefault();
                int delay = 0;
                if (Int32.TryParse(value, out delay))
                {
                    await Task.Delay(delay * 1000);
                }
            }
        }
    }
}