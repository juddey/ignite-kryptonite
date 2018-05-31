import { configure } from '@storybook/react';

function loadStories() {
  require('../src/Components/stories');
}

configure(loadStories, module);
