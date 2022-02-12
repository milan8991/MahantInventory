using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.Utility
{
    public static class Meta
    {
        public static DateTime Now = DateTime.UtcNow;
        public class OrderStatusTypes
        {
            public const string Ordered = "Ordered";
            public const string Received = "Received";
            public const string Cancelled = "Cancelled";
        }
        //public class PartyCategory
        //{
        //    public const string Merchant = "Merchant";
        //    public const string HariBhakt= "HariBhakt";
        //    public const string Trust = "Trust";
        //    public const string Saint = "Saint";
        //    public const string Unknown = "Unknown";
        //}
        public class PartyTypes
        {
            public const string Payer = "Payer";
            public const string Seller = "Seller";
            public const string Both = "Both";
        }
        public class NotificationStatusTypes
        {
            public const string Pending = "Pending";
            public const string Notified = "Notified";
            public const string Marked = "Marked";
            public const string Read = "Read";
            public const string Cancelled = "Cancelled";
        }
    }
}
