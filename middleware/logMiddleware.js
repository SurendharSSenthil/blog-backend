const logRequestDetails = (req, res, next) => {
	console.log('--- Incoming Request Details ---');
	console.log(`Method: ${req.method}`);
	console.log(`URL: ${req.originalUrl}`);
	console.log('Headers:', JSON.stringify(req.headers, null, 2));
	console.log('Body:', JSON.stringify(req.body, null, 2));
	console.log('Query Params:', JSON.stringify(req.query, null, 2));
	console.log('------------------------------');

	next();
};

module.exports = { logRequestDetails };
