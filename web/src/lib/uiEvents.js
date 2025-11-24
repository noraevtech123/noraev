export const PREORDER_EVENT = "open-preorder-form";

export const triggerPreorderForm = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PREORDER_EVENT));
};
