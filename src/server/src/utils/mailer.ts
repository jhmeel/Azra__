import SibApiSDK from 'sib-api-v3-sdk';
import {Config} from '../config/config.js';
import {logger} from './logger.js';

// Instantiate the SendinBlue API client
const sendinblue = new SibApiSDK.TransactionalEmailsApi();

// Set API key authentication
const SibClient = SibApiSDK.ApiClient.instance;
SibClient.authentications['api-key'].apiKey = Config.MAILER.API_KEY;

// Define the sender information
const sender = {
  email: Config.MAILER.EMAIL,
  name: Config.NAME,
};

const SendMail = async (userData, content) => {
  try {
    const smtpMailData = new SibApiSDK.SendSmtpEmail();

    smtpMailData.sender = sender;

    smtpMailData.to = [
      {
        email: userData.email,
        name: userData.username,
      },
    ];

    smtpMailData.subject = content.subject;

    smtpMailData.params = {
      'name': userData.username,
    };

    smtpMailData.htmlContent = content.content;

    // Send the transactional email
    await sendinblue.sendTransacEmail(smtpMailData)
      .then((data) => {
        logger.info(data);
      })
      .catch((error) => {
        logger.error(error);
        throw error
      });
  } catch (error) {
    logger.error(error);
    throw error
  }
};

export { SendMail};
