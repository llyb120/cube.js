import { Cube } from './cube';
import "./shim";

var cube = Cube.$instance = new Cube;

window.Cube = cube;

cube.start()