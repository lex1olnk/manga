export default async function(url, options = {}) {
  const suppressErrors = options?.['suppress-errors']
  delete options['suppress-errors']

  if (!options.headers) options.headers = []

  const body = options.body
  const headers = options.headers

  if (body !== null && typeof body === 'object') {
    if (!('content-type' in headers)) {
      options.headers['content-type'] = 'application/json'
    }

    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`/api${url}`, options)
    const data = await response.json()

    if ('$errors' in data) {
      setTimeout(() => {
        let message = data.$errors[0].message
        if (data.$errors[0]?.field) message = `${data.$errors[0].field}: ${message}`

        if (!suppressErrors) alert(message)
      }, 0)
    }

    return data
  } catch(exception) {
    if (exception !== 'api.repeat.stop') console.error(exception)
    return {}
  }
}
