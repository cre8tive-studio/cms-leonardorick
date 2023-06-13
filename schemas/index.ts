import blockContent from './blockContent';
import post from './post';
import person from './person';
import quotes from './quote';
import recommendation from './recommendation';

export const schemaTypes = [post, person, quotes, recommendation, blockContent];

export const translatedSchemaTypes = ['post'];
// important for type generation to work properly
export default schemaTypes;
