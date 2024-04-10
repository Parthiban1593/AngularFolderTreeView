import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
// Import other Angular Material modules as needed...

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    CdkTreeModule,
    MatDialogModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
    MatMenuModule,
    MatSelectModule
    // Add other Angular Material modules here...
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    CdkTreeModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
    MatMenuModule,
    MatSelectModule
    // Add other Angular Material modules here...
  ]
})
export class MaterialModule { }