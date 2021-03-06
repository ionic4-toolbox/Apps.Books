import { List } from "linqts";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { List as IonicList } from "@ionic/angular";
import { AppEvents } from "../../components/app.events";
import { ConfigurationService } from "../../providers/configuration.service";
import { BooksService } from "../../providers/books.service";
import { UserProfile } from "../../models/user";
import { Book, Bookmark } from "../../models/book";

@Component({
	selector: "control-book-bookmarks",
	templateUrl: "./control.bookmarks.html",
	styleUrls: ["./control.bookmarks.scss"]
})
export class BookmarksControl implements OnInit, OnDestroy {

	constructor (
		public configSvc: ConfigurationService,
		public booksSvc: BooksService
	) {
	}

	bookmarks = new Array<Bookmark>();
	profile: UserProfile;
	resources = {
		header: "Readings",
		footer: "Sync time:",
		chapter: "Chapter: ",
		position: "Position: ",
		buttons: {
			read: "Read",
			delete: "Delete"
		}
	};
	@ViewChild("list") list: IonicList;

	ngOnInit() {
		this.prepareResourcesAsync();

		if (this.configSvc.isAuthenticated) {
			this.profile = this.configSvc.getAccount().profile;
			this.prepareBookmarks();
		}

		AppEvents.on("App", async info => {
			if ("LanguageChanged" === info.args.Type) {
				await this.prepareResourcesAsync();
			}
		}, "LanguageChangedEventHandlerOfBookmarksControl");

		AppEvents.on("Session", info => {
			if ("Updated" === info.args.Type && this.configSvc.isAuthenticated) {
				this.profile = this.configSvc.getAccount().profile;
				this.prepareBookmarks();
			}
		}, "SessionEventHandlerOfBookmarksControl");

		AppEvents.on("Books", info => {
			if ("BookmarksUpdated" === info.args.Type) {
				this.prepareBookmarks();
			}
		}, "BookmarksUpdatedEventHandlerOfBookmarksControl");
	}

	ngOnDestroy() {
		AppEvents.off("App", "LanguageChangedEventHandlerOfBookmarksControl");
		AppEvents.off("Session", "SessionEventHandlerOfBookmarksControl");
		AppEvents.off("Books", "BookmarksUpdatedEventHandlerOfBookmarksControl");
	}

	async prepareResourcesAsync() {
		this.resources = {
			header: await this.configSvc.getResourceAsync("books.bookmarks.header"),
			footer: await this.configSvc.getResourceAsync("books.bookmarks.footer"),
			chapter: await this.configSvc.getResourceAsync("books.bookmarks.chapter"),
			position: await this.configSvc.getResourceAsync("books.bookmarks.position"),
			buttons: {
				read: await this.configSvc.getResourceAsync("books.bookmarks.buttons.read"),
				delete: await this.configSvc.getResourceAsync("books.bookmarks.buttons.delete")
			}
		};
	}

	prepareBookmarks() {
		this.bookmarks = new List(this.booksSvc.bookmarks.values()).OrderByDescending(o => o.Time).ToArray();
	}

	trackBookmark(index: number, bookmark: Bookmark) {
		return `${bookmark.ID}@${index}`;
	}

	getTitle(bookmark: Bookmark) {
		const book = Book.instances.getValue(bookmark.ID);
		return book !== undefined
			? book.Title + (book.Author !== "" ? " - " + book.Author : "")
			: `${bookmark.ID}@${bookmark.Chapter}#${bookmark.Position}`;
	}

	getPosition(bookmark: Bookmark) {
		const book = Book.instances.getValue(bookmark.ID);
		return book !== undefined
			? (bookmark.Chapter > 0 ? this.resources.chapter + bookmark.Chapter + " - " : "") + this.resources.position + bookmark.Position
			: `${bookmark.Chapter}#${bookmark.Position}`;
	}

	open(bookmark: Bookmark) {
		const book = Book.instances.getValue(bookmark.ID);
		if (book !== undefined) {
			this.configSvc.navigateForward(book.routerURI);
		}
	}

	async deleteAsync(bookmark: Bookmark) {
		await this.list.closeSlidingItems();
		this.booksSvc.deleteBookmark(bookmark.ID, () => this.prepareBookmarks());
	}

}
