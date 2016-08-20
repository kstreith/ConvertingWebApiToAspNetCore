using System;
using System.Net;
using ChoreApp.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ChoreApp.Filters {
    public class DataExceptionFilterAttribute : ExceptionFilterAttribute {
        public DataExceptionFilterAttribute()
        {            
        }

        public override void OnException(ExceptionContext context)
        {
            var statusCode = HttpStatusCode.OK;
            if (context.Exception is DataConflictException) {
                statusCode = HttpStatusCode.Conflict;
            } else if (context.Exception is DataMissingException) {
                statusCode = HttpStatusCode.NotFound;
            } else if (context.Exception is InvalidRequestException) {
                statusCode = HttpStatusCode.BadRequest;
            } else if (context.Exception is TimeoutException) {
                statusCode = HttpStatusCode.RequestTimeout;
            }            
            if (statusCode != HttpStatusCode.OK) {
                context.ExceptionHandled = true;
                context.Result = new StatusCodeResult((int)statusCode);
            } 
        }
    }
}