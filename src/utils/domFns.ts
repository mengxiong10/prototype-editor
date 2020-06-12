export function matchesSelectorAndParentsTo(
  el: Element,
  selector: string,
  baseNode?: Element
): boolean {
  let node: Element | null = el;
  while (node) {
    if (node.matches(selector)) return true;
    if (node === baseNode) return false;
    node = node.parentElement;
  }
  return false;
}
