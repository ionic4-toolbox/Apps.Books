import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AppFormsControl, AppFormsService } from "./forms.service";
import { PlatformUtility } from "./app.utility.platform";

@Component({
	selector: "app-form",
	templateUrl: "forms.main.component.html"
})
export class AppFormsComponent implements OnInit {
	@Input() form: FormGroup;
	@Input() controls: Array<AppFormsControl>;
	@Input() config: Array<any>;
	@Output() submitEvent: EventEmitter<any> = new EventEmitter();
	@Output() renderedEvent: EventEmitter<any> = new EventEmitter();
	@Output() refreshCaptchaEvent: EventEmitter<any> = new EventEmitter();

	constructor (
		public appFormsSvc: AppFormsService
	) {
	}

	public ngOnInit() {
		if (this.controls === undefined || this.controls === null || this.controls.length < 1) {
			if (this.config !== undefined && this.config !== null) {
				this.controls = this.appFormsSvc.getControls(this.config, this.controls);
			}
		}

		if (this.controls === undefined || this.controls === null) {
			throw new Error("Controls or config of the form need to be initialized first (controls/config attributes)");
		}
		else {
			if (this.controls.length < 1) {
				PlatformUtility.showWarning("[DynamicForms]: No control");
			}
			this.appFormsSvc.buildForm(this.form, this.controls);
			this.renderedEvent.emit(this);
		}
	}

	public onSubmit() {
		this.submitEvent.next(this.form.value);
	}

	public onRefreshCaptcha($event) {
		this.refreshCaptchaEvent.emit($event);
	}

	public controlTrackBy(index: number, item: AppFormsControl) {
		return item.Key;
	}

}