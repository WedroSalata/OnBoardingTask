import Resolver from '@forge/resolver';
import {setPublicStorage,getPublicStorage,removePublicStorage} from "./service";
import {sendMessage} from "./chat";

const resolver = new Resolver();

resolver.define('getText', (req) => {
    console.log(req);
    return 'Hello world!';
});

resolver.define('setPublicStorage', async ({ payload }) => {
    await setPublicStorage(payload.key, payload.data)
})

resolver.define('getPublicStorage', async ({payload}) => {
    return await getPublicStorage(payload.key)
})

resolver.define('removePublicStorage', async ({ payload }) => {
    await removePublicStorage(payload.key)
})

resolver.define("generateSummary", async ({}) => {
  return await sendMessage('Hello, how are you?')
});


export const handler = resolver.getDefinitions();
