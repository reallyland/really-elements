import gulp from 'gulp';

const { src, dest, series } = gulp;

export function copy() {
  return src([
    'src/**/node_modules/**/*',
  ])
  .pipe(dest('dist'));
}

const build = series([copy]);

export default build;
