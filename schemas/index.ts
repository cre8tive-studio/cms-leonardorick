import blockContent from './blockContent'
import category from './category'
import post from './post'
import person from './person'

export const schemaTypes = [post, person, category, blockContent]

export const translatedSchemaTypes = ['post']
// important for type generation to work properly
export default schemaTypes
