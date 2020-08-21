export default function ({
  app,
  store,
  route
}) {
  app.$cookiz?.set('url', route.path);
  store.dispatch('blocks/clearBlock');
}
