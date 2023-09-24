// eslint-disable-next-line import/no-extraneous-dependencies
const MailSlurp = require('mailslurp-client').default;

const mailslurp = new MailSlurp({ apiKey: '45ac38d11ed4c010b2c94171f9417d4f94363bc41f1e0623b57292adfaa09485' });

const inbox = mailslurp.createInbox();
const options = {
  to: ['nash4253@gmail.com'],
  subject: 'Hello',
  body: 'Welcome',
};
const sent = mailslurp.sendEmail(inbox.id, options);

expect(sent.subject).toContain('Hello');
