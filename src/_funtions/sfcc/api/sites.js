exports.getSites = async (envKey, token) => {
	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-get', {
		envKey,
		token,
		finalPath: `/site`
	});

	return body;
};
