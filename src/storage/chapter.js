import BaseStorage from './base-storage.js'
import knex from 'knex'

export default class extends BaseStorage {
  get table() { return 'chapter' }
  get tableBuyer() { return 'chapter_buyer' }
  get tableViewer() { return 'chapter_viewer' }

  get publicProperties() {
    return [
      'book_id',
      'number',
      'name',
      'is_public',
      'is_readable',
      'price',
      'status',
      'created_at',
      'updated_at',
      'likers_count',
      'viewers_count',
    ]
  }

  afterFetch(chapter) {
    chapter.is_public = chapter.is_public != 0

    if ('is_readable' in chapter) chapter.is_readable = chapter.is_readable != 0

    return chapter
  }

  async isReadable(chapter, actor) {
    if ('is_readable' in chapter) return chapter.is_readable

    if (chapter.is_public) return true
    if (!actor) return false
    if (actor.role === 'admin') return true
    if (chapter.created_by === actor.id) return true

    const buyerRows = await this.knex(this.tableBuyer)
      .where('chapter_id', chapter.id)
      .where('user_id', actor.id)
      .where(this.knex.raw(`${this.tableBuyer}.start_time <= NOW()`))
      .where(builder => {
        builder
          .where(this.knex.raw(`${this.tableBuyer}.end_time >= NOW()`))
          .orWhere(this.knex.raw(`${this.tableBuyer}.end_time IS NULL`))
      })
      .select('*')
    if (buyerRows.length) return true

    return false
  }

  preprocessSelectQuery(query, filter, options) {
    const within = options?.with || []

    if (within.includes('is_readable') && options.actor) {
      query
        .leftJoin(this.tableBuyer, join => {
          join
            .on(`${this.tableBuyer}.chapter_id`, `${this.table}.id`)
            .on(`${this.tableBuyer}.user_id`, options.actor.id)
            .on(this.knex.raw(`${this.tableBuyer}.start_time <= NOW()`))
            .on(join => {
              join
                .on(this.knex.raw(`${this.tableBuyer}.end_time >= NOW()`))
                .orOn(this.knex.raw(`${this.tableBuyer}.end_time IS NULL`))
            })
        })
        .select(`${this.tableBuyer}.user_id`)
        .select(this.knex.raw(`if (${this.table}.is_public, 1, if (${this.tableBuyer}.user_id = ${options.actor.id}, 1, 0)) as is_readable`))
    }
  }

  toReadable(chapter) {
    const data = this.toPublic(chapter)
    data.content = chapter.content

    return data
  }
}
