module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    kk: true,
    vant: true,
    Was: true,
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": 0,
    "vue/attributes-order": 0,
    "vue/max-attributes-per-line": [2, {
      singleline: 10,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
    "vue/html-closing-bracket-newline": ["error", {
      singleline: "never",
      multiline: "never"
    }],
    "vue/mustache-interpolation-spacing": ["error", "always"],
    "vue/no-multi-spaces": ["error", {
      ignoreProperties: false
    }],
    "vue/html-indent": [2, 4, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    "vue/html-self-closing": [2, {
      html: {
        "void": "never",
        normal: "always",
        component: "always"
      },
      svg: "always",
      math: "always"
    }],
    "vue/singleline-html-element-content-newline": 0,
    "vue/multiline-html-element-content-newline": 0,
    "vue/name-property-casing": [
      2,
      "PascalCase"
    ],
    "vue/no-side-effects-in-computed-properties": 0,
    "vue/no-use-v-if-with-v-for": 0,
    "accessor-pairs": 2,
    "arrow-spacing": [
      2,
      {
        before: true,
        after: true
      }
    ],
    "block-spacing": [
      2,
      "always"
    ],
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: true
      }
    ],
    camelcase: [
      2,
      {
        properties: "always"
      }
    ],
    "comma-spacing": [
      2,
      {
        before: false,
        after: true
      }
    ],
    "comma-style": [
      2,
      "last"
    ],
    "dot-location": [2, "property"],
    "eol-last": 2,
    eqeqeq: [
      2,
      "allow-null"
    ],
    indent: [
      "error",
      2,
      {SwitchCase:1}
    ],
    "jsx-quotes": [
      2,
      "prefer-double"
    ],
    "key-spacing": [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    "keyword-spacing": [
      2,
      {
        before: true,
        after: true
      }
    ],
    "new-cap": [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    "new-parens": 2,
    "no-array-constructor": 2,
    "no-caller": 2,
    "no-empty-character-class": 0,
    "no-empty-pattern": 0,
    "no-eval": 0,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-extra-parens": [
      2,
      "functions"
    ],
    "no-floating-decimal": 2,
    "no-implied-eval": 2,
    "no-label-var": 2,
    "no-lone-blocks": 2,
    "no-multi-spaces": 2,
    "no-multi-str": 2,
    "no-multiple-empty-lines": [
      2,
      {
        max: 2
      }
    ],
    "no-new-object": 2,
    "no-new-require": 2,
    "no-new-wrappers": 2,
    "no-obj-calls": 0,
    "no-return-assign": [
      2,
      "except-parens"
    ],
    "no-sequences": 2,
    "no-spaced-func": 2,
    "no-sparse-arrays": 1,
    "no-trailing-spaces": 2,
    "no-unexpected-multiline": 0,
    "no-unmodified-loop-condition": 0,
    "no-unneeded-ternary": 2,
    "no-unsafe-finally": 0,
    "no-useless-call": 2,
    "no-useless-computed-key": 0,
    "no-useless-constructor": 2,
    "no-whitespace-before-property": 0,
    "one-var": 2,
    "operator-linebreak": [
      2,
      "after",
      {
        overrides: {
          "?": "before",
          ":": "before"
        }
      }
    ],
    "padded-blocks": 0,
    quotes: [
      2,
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    semi: [
      2,
      "always"
    ],
    "semi-spacing": [
      2,
      {
        before: false,
        after: true
      }
    ],
    "space-before-blocks": [
      2,
      "always"
    ],
    "space-before-function-paren": [
      2,
      "never"
    ],
    "space-in-parens": [
      2,
      "never"
    ],
    "space-infix-ops": 2,
    "space-unary-ops": [
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    "spaced-comment": [
      2,
      "always"
    ],
    "template-curly-spacing": [
      2,
      "never"
    ],
    yoda: [
      2,
      "never"
    ],
    "prefer-const": 2,
    "object-curly-spacing": [
      2,
      "always",
      {
        objectsInObjects: false
      }
    ],
    "array-bracket-spacing": [
      2,
      "never"
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
