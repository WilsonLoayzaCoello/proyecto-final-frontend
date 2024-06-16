import { NgModule } from '@angular/core';

import { ImagenPipe } from './imagen.pipe';

// Modulo para los pipes
@NgModule({
  // declarations: [ImagenPipe],
  exports: [ImagenPipe],
  imports: [ImagenPipe],
})
export class PipesModule {}
