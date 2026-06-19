// plugins/cardmodal.client.js
import { createCardModal } from "@/components/Libs/CardModal/createCardModal";

export default (_ctx, inject) => {
  inject("cardModal", createCardModal({ store: _ctx.store, router: _ctx.app && _ctx.app.router }));
};
