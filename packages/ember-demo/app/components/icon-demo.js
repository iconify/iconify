import Component from '@glimmer/component';
import { disableCache, addIcon } from '@iconify/ember/components/iconify-icon';

disableCache('all');

const iconData = {
  body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
  width: 24,
  height: 24,
};

addIcon('demo', iconData);

export default class IconDemoComponent extends Component {
  iconData2 = iconData;
  get testIcon() {
    return iconData;
  }
}
