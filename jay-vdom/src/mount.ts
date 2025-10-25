import type { Rendered } from "./render";

export default function mount($node: Rendered, $target: Rendered) {
  $target.replaceWith($node);
  return $node;
}
