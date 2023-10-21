// markdownUtils.js

import React from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript"; // 例としてJavaScriptモード
import "ace-builds/src-noconflict/theme-monokai";   // Monokaiテーマの例
export const calculateEditorHeight = (content) => {
    const lines = content.split('\n').length;
    const lineHeight = 18;
    const padding = 20;
    return Math.min(lines * lineHeight + padding, 300);
};

export const markdownOptions = {
    overrides: {
        img: {
            component: ({ alt, src, ...props }) => (
                <img
                    alt={alt}
                    src={src}
                    {...props}
                    style={{ maxWidth: '100%', display: 'block', margin: '10px auto' }}
                />
            )
        },
        code: {
            component: ({ children, className }) => {
                const languageMode = className ? className.replace('language-', '') : 'text';

                if (languageMode) {
                    return (
                        <AceEditor
                            mode={languageMode}
                            theme="monokai"
                            value={children}
                            height={`${calculateEditorHeight(children)}px`}
                            readOnly={true}
                            name={`ace-editor-${Math.random()}`}
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={false}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                            }}
                            width="100%"
                            maxLines={Infinity}
                            editorProps={{ $blockScrolling: true }}
                        />
                    );
                }

                return <code>{children}</code>;
            }
        }
    }
};
