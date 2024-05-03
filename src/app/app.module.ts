import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AddFolderPopupComponent } from './popup/add-folder-popup/add-folder-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SalvoViewPopupComponent } from './popup/salvo-view-popup/salvo-view-popup.component';
import { ShareFolderPopupComponent } from './popup/share-folder-popup/share-folder-popup.component';
import { FolderInfoPopupComponent } from './popup/folder-info-popup/folder-info-popup.component';
import { ConfirmPopupComponent } from './popup/confirm-popup/confirm-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    AddFolderPopupComponent,
    SalvoViewPopupComponent,
    ShareFolderPopupComponent,
    FolderInfoPopupComponent,
    ConfirmPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
