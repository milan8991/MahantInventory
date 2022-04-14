using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.ViewModels
{
    public class Email
    {
        public string From { get; set; }
        public string ReplyTo { get; set; }
        public List<string> To { get; set; }
        public List<string> Cc { get; set; }
        public List<string> BCc { get; set; }
        public StringBuilder Subject { get; set; }
        public bool IsBodyHtml { get; set; }
        public StringBuilder Body { get; set; }
    }
}
