/*jshint node:true */

"use strict";

var util = require('util');
var Orchestrator = require('orchestrator');
var gutil = require('gulp-util');

function Gulp(){
  Orchestrator.call(this);
  this.env = gutil.env;
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.taskQueue = Gulp.prototype.seq;
Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = function(){
  // impose our opinion of "default" tasks onto orchestrator
  var tasks = arguments.length ? Array.prototype.slice.call(arguments) : ['default'];

  // check if tasks were defined
  // orchestrator will fail
  // but we just want to emit an event so the CLI can error nicely
  tasks.forEach(function(name){
    if (this.tasks[name]) return;
    this.emit('task_not_found', name);
  }, this);

  this.start.apply(this, tasks);
};

Gulp.prototype.src = require('./lib/createInputStream');
Gulp.prototype.dest = require('./lib/createOutputStream');
Gulp.prototype.watch = require('glob-watcher');

// let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

var inst = new Gulp();

module.exports = inst;
