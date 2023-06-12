import blockContent from './blockContent'
import post from './post'
import person from './person'
import quotes from './quote'

export const schemaTypes = [post, person, quotes, blockContent]

export const translatedSchemaTypes = ['post']
// important for type generation to work properly
export default schemaTypes
