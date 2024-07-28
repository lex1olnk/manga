import apiConfig from '~/config/api.js'
import error from '~/errors.js'

export function getModelName(slug, type) {
  let modelName = null

  for (const [modelSlug, name] of Object.entries(apiConfig.modelSlugs[type])) {
    if (modelSlug == slug) modelName = name
  }

  if (!modelName) throw new error.NotFound()

  return modelName
}
