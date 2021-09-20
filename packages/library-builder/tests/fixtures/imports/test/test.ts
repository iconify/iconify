// ../index.js
import { parentIndex } from '../';

// ../test.js
import { parentTest } from '../test.ts';

// ../test2/index.js
import { siblingChildIndex } from '../test2/';

// ./foo/index.js
import { fooDirectory } from './foo';
import { fooDirectorySlash } from './foo/';
import { testDirectoryIndex } from './foo/index';
import { testDirectoryIndex2 } from './foo/index.ts';

// ./bar.js
import { barFile } from './bar';
