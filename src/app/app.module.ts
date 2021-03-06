import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Device } from "@ionic-native/device/ngx";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { GoogleAnalytics } from "@ionic-native/google-analytics/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";
import { AppFormsModule } from "./components/forms.module";
import { AppReadyGuardService, RegisterGuardService, AuthenticatedGuardService, NotAuthenticatedGuardService } from "./providers/base.service";
import { ConfigurationService } from "./providers/configuration.service";
import { AuthenticationService } from "./providers/authentication.service";
import { UsersService } from "./providers/users.service";
import { FilesService } from "./providers/files.service";
import { BooksService } from "./providers/books.service";

// AOT exported function for ngx-translate factories
export function HttpLoaderFactory(http: HttpClient) {
	return new MultiTranslateHttpLoader(http, [
		{ prefix: "./assets/i18n/app/", suffix: ".json" },
		{ prefix: "./assets/i18n/users/", suffix: ".json" },
		{ prefix: "./assets/i18n/books/", suffix: ".json" },
	]);
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpModule,
		HttpClientModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot({ name: "vieappsDB" }),
		TranslateModule.forRoot({ loader: {
			provide: TranslateLoader,
			useFactory: HttpLoaderFactory,
			deps: [HttpClient]
		}}),
		AppFormsModule,
		AppRoutingModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		Device,
		Keyboard,
		AppVersion,
		FileTransfer,
		GoogleAnalytics,
		QRScanner,
		InAppBrowser,
		AppReadyGuardService,
		RegisterGuardService,
		AuthenticatedGuardService,
		NotAuthenticatedGuardService,
		ConfigurationService,
		AuthenticationService,
		UsersService,
		FilesService,
		BooksService,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
