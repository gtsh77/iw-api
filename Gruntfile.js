module.exports = function (grunt) {
grunt.initConfig({
  watch: {
      // app: {
      //  files: ['js/components/*.ts'],
      //  tasks: ['ts'
      //   //,'closureCompiler:connect'
      //  ]
      // }
      appFrontWatch: {
          files: ['src/api.ts'],
          tasks: ['ts']
      }
  },
  ts: {
    base: {
      files: [{ src: ['src/api.ts'], dest: 'dest/api.js' }],
      options: {
        module: 'system', 
        moduleResolution: 'node',
        target: 'es2015',
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        noImplicitAny: false,
        fast: 'never'
      }
    }
  }                                                              
  }
);
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks("grunt-ts");
// grunt.registerTask('dev', [ 'copy:dev', 'compass:appFront', 'string-replace:appTemplates']);
// grunt.registerTask('build', [ 'teamcity', 'ts:base', 'compass:appFrontProd', 'string-replace:appTemplates' ,'copy:prod', 'systemjs', 'import', 'closureCompiler:app']);
//grunt.registerTask('production', [ 'import', 'compass:connectFrontProd', 'string-replace:one', 'closureCompiler:connect']);
};