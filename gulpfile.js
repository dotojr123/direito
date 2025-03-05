const { src, dest } = require('gulp');

// Tarefa para copiar os ícones SVG para a pasta dist
function buildIcons() {
  return src('./nodes/**/*.svg')
    .pipe(dest('./dist/nodes/'));
}

// Exporta as tarefas
exports['build:icons'] = buildIcons; 