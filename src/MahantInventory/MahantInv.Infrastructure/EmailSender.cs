using Ardalis.GuardClauses;
using MahantInv.Core.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MahantInv.Infrastructure
{
    public class EmailService : Core.Interfaces.IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private SmtpSettings _smtpSettings { get; set; }
        public EmailService(ILogger<EmailService> logger, IOptions<SmtpSettings> smtpSettings)
        {
            _logger = logger;
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendEmailAsync(Email email)
        {
            Guard.Against.Null(email, nameof(email));

            try
            {
                // create message
                var mimeMsg = new MimeMessage();

                var defaultFrom = MailboxAddress.Parse(_smtpSettings.Sender);

                if (string.IsNullOrWhiteSpace(email.From))
                {
                    mimeMsg.From.Add(defaultFrom);
                }
                else
                {
                    mimeMsg.From.Add(MailboxAddress.Parse(email.From));
                }

                if (string.IsNullOrWhiteSpace(email.ReplyTo))
                {
                    mimeMsg.ReplyTo.Add(defaultFrom);
                }
                else
                {
                    mimeMsg.ReplyTo.Add(MailboxAddress.Parse(email.ReplyTo));
                }
                if (email.To == null || !email.To.Any())
                {
                    email.To = new List<string>(_smtpSettings.To.Split(","));
                }
                if ((email.Cc == null || !email.Cc.Any()) && !string.IsNullOrWhiteSpace(_smtpSettings.CC))
                {
                    email.Cc = new List<string>(_smtpSettings.CC.Split(","));
                }
                this.AddEmails(mimeMsg.To, email.To);
                this.AddEmails(mimeMsg.Cc, email.Cc);

                mimeMsg.Subject = email.Subject.ToString();

                if (email.IsBodyHtml)
                {
                    mimeMsg.Body = new TextPart(TextFormat.Html) { Text = email.Body.ToString() };
                }
                else
                {
                    mimeMsg.Body = new TextPart(TextFormat.Plain) { Text = email.Body.ToString() };
                }

                // send email
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_smtpSettings.SmtpServer, _smtpSettings.Port, _smtpSettings.SSL);

                if (!string.IsNullOrWhiteSpace(_smtpSettings.UserName))
                    await smtp.AuthenticateAsync(_smtpSettings.UserName, _smtpSettings.Password);

                await smtp.SendAsync(mimeMsg);
                await smtp.DisconnectAsync(true);
                //_logger.LogDebug($"Sending email to {to} from {from} with subject {subject}.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Unexpected error while sending email.");
                throw;
            }
        }


        private void AddEmails(InternetAddressList list, List<string> emails)
        {
            if (emails?.Count > 0)
            {
                list.AddRange(emails.Select(e => MailboxAddress.Parse(e)));
            }
        }
    }
}
