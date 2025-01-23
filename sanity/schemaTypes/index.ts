import { type SchemaTypeDefinition } from 'sanity'
import shopco from './shopco'
import colors from './colors'
import sizes from './sizes'
import newsletter from './newsletter'
import users from './users'
import category from './category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [shopco,colors,sizes,newsletter,users,category],
}
