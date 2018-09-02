import { Component, Input } from "@angular/core";
import { AppUtility } from "../../components/app.utility";
import { PlatformUtility } from "../../components/app.utility.platform";
import { ConfigurationService } from "../../providers/configuration.service";
import { BooksService } from "../../providers/books.service";
import { Book } from "../../models/book";

@Component({
	selector: "control-book-grid",
	templateUrl: "./control.book.grid.html",
	styleUrls: ["./control.book.grid.scss"]
})
export class BookGridControl {

	constructor (
		public configSvc: ConfigurationService,
		public booksSvc: BooksService
	) {
	}

	@Input() book: Book;
	@Input() hideAuthor: boolean;
	@Input() hideCategory: boolean;

	get routerLink() {
		return this.booksSvc.getBookURI(this.book);
	}

	get queryParams() {
		return this.booksSvc.getBookQueryParams(this.book);
	}

	open() {
		this.configSvc.navigateForward(PlatformUtility.getURI(this.routerLink, this.queryParams));
	}
}
