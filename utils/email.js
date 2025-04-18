const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
    constructor(userOrUsers, url, postExcerpt, postTitle, postCategory) {
        if (Array.isArray(userOrUsers)) {
            // If multiple users (for bulk email)
            this.recipients = userOrUsers;
            this.to = userOrUsers.map(user => user.email).join(','); // Emails for bulk sending
            this.firstNames = userOrUsers.map(user => user.name.split(" ")[0]); // First names for bulk
        } else {
            // If a single user (for personalized email)
            this.recipients = [userOrUsers];
            this.to = userOrUsers.email;
            this.firstName = userOrUsers.name.split(" ")[0];
        }

        this.url = url;
        this.postExcerpt = postExcerpt;
        this.postTitle = postTitle;
        this.postCategory = postCategory;
        this.from = `Wavehub Nigeria <${process.env.EMAIL_USER}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_PORT == 465, // Use TLS for port 465
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });
    }

    async send(template, subject, additionalData = {}) {
        for (let recipient of this.recipients) {
            const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
                firstName: recipient.name.split(" ")[0], // Personalization
                subject,
                ...additionalData // Dynamically pass only the necessary data
            });
    
            const mailOptions = {
                from: this.from,
                to: recipient.email, // Send to each user individually
                subject,
                html
            };
    
            await this.newTransport().sendMail(mailOptions);
        }
    }
    

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Our Blog — Let’s Explore Together!');
    }

    async sendPostNotification() {
        await this.send(
            'newPostNotification',
            `New Post Alert: ${this.postTitle} is Live!`,
            {
                postTitle: this.postTitle,
                postExcerpt: this.postExcerpt,
                postCategory: this.postCategory,
                postUrl: this.url
            }
        );
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
};
