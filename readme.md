### Template Mailer

Template mailer allow you to send messages by using template files. This module
uses nunjucks templating library and mandrill transactional mail service.

```sh
npm install template-mailer
```

### Usage

```js
var send = require('template-mailer')({
	email_dir: path.join(__dirname, '/emails'),
	mandrill_key: "0NOVG1HyZGjrMDPnkS279w"
});

send({
	file_name: 'mymsg.html',
	to_name: 'John Doe',
	to_email: 'john.doe@example.com',
	from_name: 'Gloria Doe',
	from_email: 'gloria.doe@example.com',
	subject: 'Dear Bro, You are popular',
	data: {
		prop1: 'value',
		prop2: 'value 2'
	}
}).then(function (resp) {
	console.log('Success: ', resp)
}).catch(function(err){
	console.log("Error: ", err);
})
```

The module requires the following properties to initialize it

* *email_dir* (required): The directory where your nunjucks email files are located.
* *mandrill_key* (required): Your mandril API key

The send() function takes an object with the following properties:

* *file_name* (required): This is the name of the file (email content) to send. This file can be a nunjucks template file
or just a regular file. Data can be passed to the template using the data property described below.

* *to_name* (required, type=string): The name of the receiver
* *to_email* (required, type=string): The email of the receiver
* *from_name* (required, type=string): The name of the sender
* *from_email* (required), type=string: The email of the sender
* *subject* (required, type=string): The subject of the message
* *data*: (optional, type=object): The data to pass to the template

Because we use Nunjucks as our template library, you can use nunjucks includes and blocks in 
your email files.

### License
MIT

