const metaUrl = import.meta.url;
const knownPath = "/js/host.js";
let root;

export function getRoot() {
  if (root === undefined) {
    root = metaUrl.replace(knownPath, "");
  }
  return root;
}
