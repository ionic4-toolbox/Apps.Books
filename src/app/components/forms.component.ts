import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AppFormsControl, AppFormsService } from "./forms.service";
import { PlatformUtility } from "./app.utility.platform";

@Component({
	selector: "app-form",
	templateUrl: "./forms.component.html"
})
export class AppFormsComponent implements OnInit, OnDestroy, AfterViewInit {

	constructor (
		public appFormsSvc: AppFormsService
	) {
	}

	@Input() form: FormGroup;
	@Input() controls: Array<AppFormsControl>;
	@Input() config: Array<any>;
	@Input() value: any;
	@Input() lastFocus: any;

	@Output() initEvent: EventEmitter<any> = new EventEmitter();
	@Output() submitEvent: EventEmitter<any> = new EventEmitter();
	@Output() refreshCaptchaEvent: EventEmitter<any> = new EventEmitter();

	ngOnInit() {
		if ((this.controls === undefined || this.controls.length < 1) && this.config !== undefined) {
			this.controls = this.appFormsSvc.getControls(this.config, this.controls);
		}

		if (this.controls === undefined) {
			throw new Error("Controls or config of the form need to be initialized first (controls/config attributes)");
		}
		else if (this.controls.length < 1) {
			console.warn("[Forms]: No control");
		}
		else {
			this.appFormsSvc.buildForm(this.form, this.controls, this.value);
		}

		this.form["_controls"] = this.controls;
		this.initEvent.emit(this);
	}

	ngAfterViewInit() {
		this.appFormsSvc.focus(this.controls.find(control => control.Options.AutoFocus));
	}

	ngOnDestroy() {
		this.initEvent.unsubscribe();
		this.submitEvent.unsubscribe();
		this.refreshCaptchaEvent.unsubscribe();
	}

	onRefreshCaptcha($event) {
		this.refreshCaptchaEvent.emit($event);
	}

	onLastFocus($event) {
		PlatformUtility.focus(this.lastFocus);
	}

	onSubmit() {
		this.submitEvent.next(this.form.value);
	}

	trackControl(index: number, control: AppFormsControl) {
		return control.Name;
	}

}
