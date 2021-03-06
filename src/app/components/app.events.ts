import * as Rx from "rxjs";
import { AppUtility } from "./app.utility";

/** Servicing component for working with app events */
export class AppEvents {

	private static _handlers: {
		[key: string]: Array<{ func: (info: { event: string, args: any }) => void, identity: string }>
	} = {};
	private static _subject: Rx.Subject<{ event: string, args: any }> = undefined;

	private static getHandlers(event: string) {
		this._handlers[event] = this._handlers[event] || [];
		return this._handlers[event];
	}

	private static initialize() {
		if (this._subject === undefined) {
			this._subject = new Rx.Subject<{ event: string, args: any }>();
			this._subject.subscribe(({ event, args }) => {
				this.getHandlers(event).forEach(handler => handler.func({ event: event, args: args || {} }));
			});
		}
	}

	/**
	  * Registers a handler for processing data when a specified event has been raised/broadcasted
	  * @param event The string that presents the name of an event
	  * @param handler The function to handler data when an event was raised
	  * @param identity The string that presents identity of the handler for unregistering later
	*/
	public static on(event: string, handler: (info: { event: string, args: any }) => void, identity?: string) {
		this.initialize();
		if (AppUtility.isNotEmpty(event) && handler !== undefined) {
			this.getHandlers(event).push({
				func: handler,
				identity: AppUtility.isNotEmpty(identity) ? identity : ""
			});
		}
	}

	/**
	  * Unregisters a handler
	  * @param event The string that presents the name of an event
	  * @param identity The string that presents the identity of the handler for unregistering
	*/
	public static off(event: string, identity: string) {
		this.initialize();
		if (AppUtility.isNotEmpty(event) && AppUtility.isNotEmpty(identity)) {
			const handlers = this.getHandlers(event);
			AppUtility.removeAt(handlers, handlers.findIndex(handler => identity === handler.identity));
		}
	}

	/**
	  * Broadcasts an event message through the app scope
	  * @param event The string that presents the name of an event
	  * @param args The JSON object that presents the arguments of an event
	*/
	public static broadcast(event: string, args?: any) {
		this.initialize();
		this._subject.next({ event, args });
	}

}
