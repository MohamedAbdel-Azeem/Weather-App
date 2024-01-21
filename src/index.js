import _ from 'lodash';
import tailwindcss from "./output.css";

 function component() {
   const element = document.createElement('div');

  // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack', 'testing'], ' ');
   element.classList = 'text-3xl font-bold underline text-red-500';
   return element;
 }

 document.body.appendChild(component());