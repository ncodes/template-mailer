/**
 * Template Mailer
 * A library to send template files prefilled with data as an email.
 */

var Promise	 = require('bluebird'),
	fs 		 = require('fs'),
	path     = require('path'),
	Mandrill = require('node-mandrill'),
	Nunjucks = require('nunjucks');

/**
 * Entry point. Returns a send function for sending
 * emails.
 * @param  {object} config 				configutation
 * @return {string} config.email_dir	email template directory
 */
module.exports =  function(config){

	var config = config || {};

	// email directory is required
	if (!config.email_dir)
		throw new Error('email_dir config value is required');

	// mandrill key is required
	if (!config.mandrill_key)
		throw new Error('mandrill_key is required');

	// initialize mandrill
	var mandrill = Mandrill(config.mandrill_key);

	/**
	 * Send email.
	 * Fetches the email template from the email template directory
	 * and parse the email with the parsed in data and send using mandril
	 * 
	 * @param  {Object} options					Options
	 *                  options.file_name       the file name of the content to send
	 *                  options.to_email		the receivers email
	 *                  options.to_name			the receivers name
	 *                  options.from_email		the senders email
	 *                  options.from_name		the senders name 	
	 */
	return function(options) {

		var options = options || {};
		options.data = options.data || {};

		if ('object' != typeof options)		
			throw new Error('options is not an object');
			
		if (!options.file_name)
			throw new Error('file name (file_name) option is required');

		if (!options.to_name) 
			throw new Error('receiver\'s (to_name) name option is required')

		if (!options.to_email) 
			throw new Error('receiver\'s (to_email) email option is required')

		if (!options.from_name) 
			throw new Error('sender\'s (from_name) name option is required')

		if (!options.from_email) 
			throw new Error('sender\'s (from_email) email option is required')

		if (!options.subject) 
			throw new Error('subject (subject) option is required')

		return new Promise(function(resolve, reject){

			// add directory locations for convenience
			options.data.emailDir = config.email_dir;

			// read the email template file
			fs.readFile(path.join(options.data.emailDir, options.file_name), function(err, emailContent){

				// something went wrong...abort
				if (err) return reject(err);

				// create a new nunjucks environment and parse the email template 
				var env = new Nunjucks.Environment(new Nunjucks.FileSystemLoader(options.data.emailDir));
				env.renderString(emailContent.toString(), options.data, function(err, parsedEmailContent){

					if (err) return reject(err);

					// if testParseMode mode is on, dont send actual mail, just return parsed email content
					if (options.testParseMode) {
						return resolve(parsedEmailContent);
					}

					mandrill('/messages/send', {
					    message: {
					        to: [{ email: options.to_email, name: options.to_name }],
					        from_email: options.from_email,
					        from_name: options.from_name,
					        subject: options.subject,
					        html: parsedEmailContent
					    }
					}, function(error, response){
					    //uh oh, there was an error
					    if (error) return reject("Unable to send: " + error.message);
					    return resolve(response);
					});
				});
			});
		});
	}
}