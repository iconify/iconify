import { startCli } from './cli-start';
import { handleError } from './cli-errors';

startCli().catch(handleError);
