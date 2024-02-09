module.exports = {
  extends: [
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-rational-order',
    // 'stylelint-config-prettier-scss',
  ],
  rules: {
    'order/properties-order': [[], { severity: 'warning' }],
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': true,
        'empty-line-between-groups': true,
        severity: 'warning',
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'include', 'layer'],
      },
    ],
  },
  plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
};
