import React from "react";
import { useAppTheme } from "../../theme";
import useMarkdownStyles from "../../hooks/useMarkdownStyles";
import SyntaxHighlighter from "react-syntax-highlighter";

import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownCodeBlock = ({ node, children }) => {
  const { colors } = useAppTheme();
  const styles = useMarkdownStyles();

  const isDark = colors.text === "#FFFFFF";

  const codeString = String(children[0]?.props?.children || "").replace(
    /\n$/,
    ""
  );
  const language = node?.data?.lang || "plaintext";

  const containerStyle = styles.code_block;

  const syntaxTheme = isDark ? atomOneDark : atomOneLight;

  const mergedStyle = {
    ...containerStyle,
    backgroundColor: syntaxTheme.re.backgroundColor,
    color: undefined,
    padding: 16,
  };

  return (
    <SyntaxHighlighter
      style={syntaxTheme}
      language={language}
      customStyle={mergedStyle}
      CodeTag={() => null}
      PreTag={() => null}
      highlighter={"prism"}
    >
      {codeString}
    </SyntaxHighlighter>
  );
};

export default MarkdownCodeBlock;
