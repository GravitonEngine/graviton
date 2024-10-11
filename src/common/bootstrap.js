/**
MIT License

Copyright (c) 2024 Graviton Engine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const path = require('path');

const ROOT_DIR = process.cwd();    

function Path (dir) {
    return path.join(ROOT_DIR, dir);
}

function LoadModule(app, module)
{
  let source = Path(module.base_dir + module.source);
  let path = module.path;
  try {
    let loaded_module = require(source);
    if(path) {
      app.use(path, loaded_module);
    } else {
      app.use(loaded_module);
    }
    if(module.locals) {
      Object.keys(module.locals).forEach(key => {
        let value = module.locals[key];
        loaded_module.locals[key] = value;
      });
    }
    console.log(`\t [OK] ${module.source}`);
  } catch (error) {
    console.log(`\t [FAILED] ${module.source} - ${error.message}`);
    throw error;
  }
}

function LoadConfig(app, path, base_dir) {
  let config = require( Path(path) );
  console.log(`Loading Application: ${config.name} (${path})`);
  if(config.modules) {
    config.modules.forEach(module => {
      if(!module.enabled) {
        console.log(`\t [DISABLED] ${module.source}`);
        return;
      }      
      module.base_dir = base_dir;
      LoadModule(app, module);
    });  
  }
}

// expose functions
exports.LoadModule = LoadModule;
exports.LoadConfig = LoadConfig;