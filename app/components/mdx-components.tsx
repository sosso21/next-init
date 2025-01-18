// components/mdx-remote.js
import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
  div: (props: any) => <div {...props}>{props.children}</div>,
};

export function CustomMDX(props: any) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
