export default function ({
  app,
  store,
  route
}) {
  app.$cookiz?.set('url', route.path);
  store.dispatch('blocks/clearBlock');
  // app.router.beforeEach((to, from, next) => {
  //   console.log(to)
  //   if(store.getters['card/isFormChanged']){
  //     if(confirm("Возможно, внесенные изменения не сохранятся. Продолжить?")) {
  //       next(true)
  //     } else {
  //       next(false)
  //     }
  //   }
  //   else{
  //     next(true)
  //   }
  // });
}
