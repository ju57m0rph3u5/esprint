import glob from 'glob';
import { CLIEngine } from 'eslint';
import LintRunner from '../LintRunner';
import { flatten } from '../util';

const ROOT_DIR = process.cwd();
const eslint = new CLIEngine({ cwd: ROOT_DIR });

export const check = (options) => {
  const {
    workers,
    paths,
    json
  } = options;

  const lintRunner = new LintRunner(workers);
  
  const filePaths = flatten(paths.map(globPath => glob.sync(globPath)));

  lintRunner.run({ cwd: ROOT_DIR }, filePaths)
    .then((results) => {
      results = results.filter((result) => {
        return result.warningCount > 0 || result.errorCount > 0;
      });

      if (json) {
        console.log(JSON.stringify(results));
      } else {
        const formatter = eslint.getFormatter();
        console.log(formatter(results));
      }
      process.exit(results.length > 0 ? 1 : 0);
    });
};
