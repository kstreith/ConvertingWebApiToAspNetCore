using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp.Models
{
    public class User
    {
        public User(int id, string name)
        {
            Id = id;
            Name = name;
        }
        public int Id { get; private set; }
        public String Name { get; private set; }
    }
}