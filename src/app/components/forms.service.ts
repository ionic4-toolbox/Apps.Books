import { Injectable } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormArray } from "@angular/forms";
import { Validators, ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { CompleterData, CompleterItem } from "ng2-completer";
import { LoadingController, AlertController, ActionSheetController } from "@ionic/angular";
import { AppUtility } from "./app.utility";
import { PlatformUtility } from "./app.utility.platform";

/** Configuration of a control in the dynamic forms */
export class AppFormsControl {

	constructor (
		options?: any,
		order?: number
	) {
		if (options !== undefined) {
			this.assign(options, this, order);
		}
	}

	Key = "";
	Type = "TextBox";
	Required = false;
	Validators: Array<ValidatorFn> | Array<string> = undefined;
	AsyncValidators: Array<AsyncValidatorFn> | Array<string> = undefined;
	Order = 0;
	Excluded = false;
	Extras: { [key: string]: any } = {};
	Options = {
		Type: "text",
		Label: undefined as string,
		LabelOptions: {
			Position: "stacked",
			Color: "",
			Css: ""
		},
		Description: undefined as string,
		DescriptionOptions: {
			Css: "",
			Style: ""
		},
		Icon: "",
		Name: "",
		Css: "",
		PlaceHolder: undefined as string,
		Disabled: false,
		ReadOnly: false,
		AutoFocus: false,
		Min: undefined as any,
		Max: undefined as any,
		MinLength: undefined as number,
		MaxLength: undefined as number,
		Width: undefined as string,
		MinWidth: undefined as string,
		MaxWidth: undefined as string,
		Height: undefined as string,
		MinHeight: undefined as string,
		MaxHeight: undefined as string,
		SelectOptions: {
			Values: undefined as Array<{ Value: string, Label: any }>,
			Multiple: false,
			AsBoxes: false,
			Interface: "alert",
			InterfaceOptions: undefined as any,
			CancelText: undefined as string,
			OKText: undefined as string,
		},
		DateOptions: {
			AllowTimes: false,
			DisplayFormat: undefined as string,
			PickerFormat: undefined as string,
			DayNames: undefined as string,
			DayShortNames: undefined as string,
			MonthNames: undefined as string,
			MonthShortNames: undefined as string,
			CancelText: undefined as string,
			DoneText: undefined as string,
		},
		CompleterOptions: {
			SearchingText: "Searching...",
			NoResultsText: "Not found",
			PauseMiliseconds: 123,
			ClearSelected: false,
			DataSource: undefined as CompleterData,
			Handlers: {
				Initialize: undefined as (formControl: AbstractControl) => void,
				GetInitialValue: undefined as (formControl: AbstractControl) => any,
				OnItemSelected: undefined as (formControl: AbstractControl, item: CompleterItem) => void
			}
		}
	};
	SubControls: {
		AsArray: boolean,
		Controls: Array<AppFormsControl>
	} = undefined;

	private assign(options: any, control?: AppFormsControl, order?: number, alternativeKey?: string) {
		control = control || new AppFormsControl();
		control.Order = options.Order || options.order || order || 0;

		control.Key = options.Key || options.key || (alternativeKey !== undefined ? `${alternativeKey}_${control.Order}` : `c_${control.Order}`);
		control.Type = options.Type || options.type || "TextBox";
		control.Required = !control.Excluded && !!options.Required;

		control.Validators = options.Validators;
		control.AsyncValidators = options.AsyncValidators;

		control.Excluded = !!(options.Excluded || options.excluded);
		control.Extras = options.Extras || options.extras || {};

		const controlOptions = options.Options || options.options;
		if (controlOptions !== undefined && controlOptions !== null) {
			control.Options.Type = controlOptions.Type || controlOptions.type || "text";

			control.Options.Label = controlOptions.Label || controlOptions.label;
			const labelOptions = controlOptions.LabelOptions || controlOptions.labeloptions;
			if (labelOptions !== undefined && labelOptions !== null) {
				control.Options.LabelOptions.Position = labelOptions.Position || labelOptions.position || "stacked";
				control.Options.LabelOptions.Color = labelOptions.Color || labelOptions.color || "";
				control.Options.LabelOptions.Css = labelOptions.Css || labelOptions.css || "";
			}

			control.Options.Description = controlOptions.Description || controlOptions.description;
			const descriptionOptions = controlOptions.DescriptionOptions || controlOptions.descriptionoptions;
			if (descriptionOptions !== undefined && descriptionOptions !== null) {
				control.Options.DescriptionOptions.Css = (descriptionOptions.Css || descriptionOptions.css || "").replace("--platform-label-css", "label " + (PlatformUtility.isAppleOS ? "label-ios" : "label-md")).replace("--description-label-css", "description");
				control.Options.DescriptionOptions.Style = descriptionOptions.Style || descriptionOptions.style || "";
			}

			control.Options.PlaceHolder = controlOptions.PlaceHolder || controlOptions.placeholder;
			control.Options.Css = controlOptions.Css || controlOptions.css || "";
			control.Options.Icon = controlOptions.Icon || controlOptions.icon;
			control.Options.Name = alternativeKey !== undefined ? `${alternativeKey}-${control.Key}` : `${control.Key}`;

			control.Options.Disabled = !!(controlOptions.Disabled || controlOptions.disabled);
			control.Options.ReadOnly = !!(controlOptions.ReadOnly || controlOptions.readonly);
			control.Options.AutoFocus = !!(controlOptions.AutoFocus || controlOptions.autofocus);

			control.Options.Min = controlOptions.Min || controlOptions.min;
			control.Options.Max = controlOptions.Max || controlOptions.max;

			control.Options.MinLength = controlOptions.MinLength || controlOptions.minlength;
			control.Options.MaxLength = controlOptions.MaxLength || controlOptions.maxlength;

			control.Options.Width = controlOptions.Width || controlOptions.width;
			control.Options.MinWidth = controlOptions.MinWidth || controlOptions.minwidth;
			control.Options.MaxWidth = controlOptions.MaxWidth || controlOptions.maxwidth;

			control.Options.Height = controlOptions.Height || controlOptions.height;
			control.Options.MinHeight = controlOptions.MinHeight || controlOptions.minheight;
			control.Options.MaxHeight = controlOptions.MaxHeight || controlOptions.maxheight;

			const selectOptions = controlOptions.SelectOptions || controlOptions.selectoptions;
			if (selectOptions !== undefined && selectOptions !== null) {
				control.Options.SelectOptions = {
					Values: ((selectOptions.Values || selectOptions.values) as Array<any> || []).map(kvp => {
						return {
							Value: kvp.Value || kvp.value,
							Label: kvp.Label || kvp.label
						};
					}),
					Multiple: !!(selectOptions.Multiple || selectOptions.multiple),
					AsBoxes: !!(selectOptions.AsBoxes || selectOptions.asboxes),
					Interface: selectOptions.Interface || selectOptions.interface || "alert",
					InterfaceOptions: selectOptions.InterfaceOptions || selectOptions.interfaceoptions,
					CancelText: selectOptions.CancelText || selectOptions.canceltext,
					OKText: selectOptions.OKText || selectOptions.oktext
				};
			}

			const dateOptions = controlOptions.DateOptions || controlOptions.dateoptions;
			if (dateOptions !== undefined && dateOptions !== null) {
				control.Options.DateOptions = {
					AllowTimes: !!(dateOptions.AllowTimes || dateOptions.allowtimes),
					DisplayFormat: dateOptions.DisplayFormat || dateOptions.displayformat,
					PickerFormat: dateOptions.PickerFormat || dateOptions.pickerformat,
					DayNames: dateOptions.DayNames || dateOptions.daynames,
					DayShortNames: dateOptions.DayShortNames || dateOptions.dayshortnames,
					MonthNames: dateOptions.MonthNames || dateOptions.monthnames,
					MonthShortNames: dateOptions.MonthShortNames || dateOptions.monthshortnames,
					CancelText: dateOptions.CancelText || dateOptions.canceltext,
					DoneText: dateOptions.DoneText || dateOptions.donetext
				};
			}

			const completerOptions = controlOptions.CompleterOptions || controlOptions.completeroptions;
			if (completerOptions !== undefined && completerOptions !== null) {
				const handlers = completerOptions.Handlers || completerOptions.handlers || {};
				control.Options.CompleterOptions = {
					SearchingText: completerOptions.SearchingText || completerOptions.searchingtext || "Searching...",
					NoResultsText: completerOptions.NoResultsText || completerOptions.noresultstext || "Not found",
					PauseMiliseconds: completerOptions.PauseMiliseconds || completerOptions.pausemiliseconds || 123,
					ClearSelected: !!(completerOptions.ClearSelected || completerOptions.clearselected),
					DataSource: completerOptions.DataSource || completerOptions.datasource,
					Handlers: {
						Initialize: handlers.Initialize || handlers.initialize,
						GetInitialValue: handlers.GetInitialValue || handlers.getinitialvalue,
						OnItemSelected: handlers.OnItemSelected || handlers.onitemselected
					}
				};
			}
		}

		const subControls = options.SubControls || options.subcontrols;
		if (subControls !== undefined && subControls !== null) {
			const subConfig = subControls.Controls || subControls.controls;
			if (subConfig !== undefined && subConfig !== null && Array.isArray(subConfig)) {
				control.SubControls = {
					AsArray: !!(subControls.AsArray || subControls.asarray),
					Controls: (subConfig as Array<any>).map((suboptions, suborder) => this.assign(suboptions, undefined, suborder, control.Key)).sort((a, b) => a.Order - b.Order)
				};
				if (control.SubControls.Controls.length < 1) {
					control.SubControls = undefined;
				}
			}
		}

		return control;
	}

	/** Adds sub-controls of the form array */
	public addSubControls(length: number) {
		if (this.SubControls !== undefined && this.SubControls.AsArray) {
			while (this.SubControls.Controls.length < length) {
				this.SubControls.Controls.push(this.SubControls.Controls[0].clone(this.SubControls.Controls.length));
			}
		}
	}

	/** Copies the options of this control */
	public copy(onPreCompleted?: (options: Array<any>) => void) {
		const options = AppUtility.clone(this, ["Order", "Validators", "AsyncValidators"]);
		options.Validators = this.Validators;
		options.AsyncValidators = this.AsyncValidators;
		options.Options.SelectOptions.InterfaceOptions = this.Options.SelectOptions.InterfaceOptions;
		options.Options.CompleterOptions.DataSource = this.Options.CompleterOptions.DataSource;
		options.Options.CompleterOptions.Handlers = this.Options.CompleterOptions.Handlers;
		if (onPreCompleted !== undefined) {
			onPreCompleted(options);
		}
		return options;
	}

	/** Clones this control */
	public clone(order?: number, onPreCompleted?: (control: AppFormsControl) => void) {
		const control = new AppFormsControl(this.copy(), order);
		if (onPreCompleted !== undefined) {
			onPreCompleted(control);
		}
		return control;
	}

	/** Gets uri of the captcha image */
	public get captchaUri() {
		return this.Type === "Captcha" ? this.Extras["Uri"] : undefined;
	}

	/** Sets uri of the captcha image */
	public set captchaUri(value: string) {
		if (this.Type === "Captcha") {
			this.Extras["Uri"] = value;
		}
	}

}

@Injectable()
export class AppFormsService {

	constructor (
		public loadingController: LoadingController,
		public alertController: AlertController,
		public actionsheetController: ActionSheetController
	) {
	}

	private _loading = undefined;
	private _actionsheet = undefined;

	/** Gets the definition of all controls */
	public getControls(config: Array<any> = [], controls?: Array<AppFormsControl>) {
		controls = controls || new Array<AppFormsControl>();
		config.map((options, order) => new AppFormsControl(options, order)).sort((a, b) => a.Order - b.Order).forEach(control => controls.push(control));
		return controls;
	}

	/** Updates the definition of all controls */
	public updateControls(controls: Array<AppFormsControl>, value: any = {}) {
		controls.filter(control => control.SubControls !== undefined).forEach(control => {
			if (control.SubControls.AsArray) {
				const values = value[control.Key] as Array<any>;
				control.addSubControls(values.length);
				control.SubControls.Controls.forEach((subcontrol, subindex) => {
					if (subcontrol.SubControls !== undefined) {
						this.updateControls(subcontrol.SubControls.Controls, values[subindex]);
					}
				});
			}
			else {
				this.updateControls(control.SubControls.Controls, value[control.Key]);
			}
		});
	}

	/** Builds the form */
	public buildForm(form: FormGroup, controls: Array<AppFormsControl> = [], value?: any, validators?: Array<ValidatorFn>, asyncValidators?: Array<AsyncValidatorFn>) {
		if (value !== undefined && value !== null) {
			this.updateControls(controls, value);
			this.getFormGroup(controls, form, validators, asyncValidators);
			form.patchValue(value);
		}
		else {
			this.getFormGroup(controls, form, validators, asyncValidators);
		}
	}

	private getFormGroup(controls: Array<AppFormsControl>, formGroup?: FormGroup, validators?: Array<ValidatorFn>, asyncValidators?: Array<AsyncValidatorFn>) {
		formGroup = formGroup || new FormGroup({}, validators, asyncValidators);
		controls.forEach(control => {
			if (control.SubControls === undefined && control.Type === "Completer" && control.Options.Type === "Address") {
				const options = control.copy();
				["County", "Province", "Country"].forEach(key => formGroup.addControl(key, this.getFormControl(new AppFormsControl(options))));
			}
			else {
				const formControl = control.SubControls === undefined
					? this.getFormControl(control)
					: control.SubControls.AsArray
						? this.getFormArray(control, this.getValidators(control), this.getAsyncValidators(control))
						: this.getFormGroup(control.SubControls.Controls, undefined, this.getValidators(control), this.getAsyncValidators(control));
				formGroup.addControl(control.Key, formControl);
			}
		});
		return formGroup;
	}

	private getFormArray(control: AppFormsControl, validators?: Array<ValidatorFn>, asyncValidators?: Array<AsyncValidatorFn>) {
		const formArray = new FormArray([], validators, asyncValidators);
		control.SubControls.Controls.forEach(subcontrol => {
			if (subcontrol.SubControls === undefined && subcontrol.Type === "Completer" && subcontrol.Options.Type === "Address") {
				const options = subcontrol.copy();
				const formGroup = new FormGroup({}, this.getValidators(subcontrol), this.getAsyncValidators(subcontrol));
				["County", "Province", "Country"].forEach(key => formGroup.addControl(key, this.getFormControl(new AppFormsControl(options))));
				formArray.push(formGroup);
			}
			else {
				const formControl: AbstractControl = subcontrol.SubControls === undefined
					? this.getFormControl(subcontrol)
					: subcontrol.SubControls.AsArray
						? this.getFormArray(subcontrol, this.getValidators(subcontrol), this.getAsyncValidators(subcontrol))
						: this.getFormGroup(subcontrol.SubControls.Controls, undefined, this.getValidators(subcontrol), this.getAsyncValidators(subcontrol));
				formArray.push(formControl);
			}
		});
		return formArray;
	}

	private getFormControl(control: AppFormsControl) {
		return new FormControl({ value: "", disabled: control.Options.Disabled }, this.getValidators(control), this.getAsyncValidators(control));
	}

	private getValidators(control: AppFormsControl) {
		let validators = new Array<ValidatorFn>();

		if (control.Validators !== undefined && control.Validators !== null && control.Validators.length > 0) {
			if (typeof control.Validators[0] === "string") {

			}
			else {
				validators = control.Validators as Array<ValidatorFn>;
			}
		}

		if (control.Required) {
			validators.push(Validators.required);
		}

		if (control.Options.Type === "text" || control.Options.Type === "email" || control.Options.Type === "password" || control.Options.Type === "tel" || control.Options.Type === "url") {
			if (control.Options.MinLength > 0) {
				validators.push(Validators.minLength(control.Options.MinLength));
			}
			if (control.Options.MaxLength > 0) {
				validators.push(Validators.maxLength(control.Options.MaxLength));
			}
			if (control.Options.Type === "email") {
				validators.push(Validators.pattern("([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})"));
			}
		}

		if (control.Options.Type === "number" || control.Options.Type === "date") {
			if (control.Options.Min > 0) {
				validators.push(Validators.min(control.Options.Min));
			}
			if (control.Options.Max > 0) {
				validators.push(Validators.max(control.Options.Max));
			}
		}

		return validators;
	}

	private getAsyncValidators(control: AppFormsControl) {
		const asyncValidators = new Array<AsyncValidatorFn>();
		return asyncValidators;
	}

	/** Sets value of the form (also modify the FormArray controls if the length is not matched) */
	public setValue(form: FormGroup, controls: Array<AppFormsControl>, value: any = {}) {
		this.updateControls(controls, value);
		Object.keys(form.controls).forEach(key => delete form.controls[key]);
		this.buildForm(form, controls, value);
	}

	/** Highlights all invalid controls (by mark as dirty on all invalid controls) */
	public highlightInvalids(form: FormGroup) {
		this.highlightInvalidsFormGroup(form);
	}

	private highlightInvalidsFormGroup(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(key => {
			const control = formGroup.controls[key];
			if (control.invalid) {
				if (control instanceof FormGroup) {
					this.highlightInvalidsFormGroup(control as FormGroup);
				}
				else if (control instanceof FormArray) {
					this.highlightInvalidsFormArray(control as FormArray);
				}
				else {
					control.markAsDirty();
				}
			}
		});
	}

	private highlightInvalidsFormArray(formArray: FormArray) {
		formArray.controls.filter(control => control.invalid).forEach(control => {
			if (control instanceof FormGroup) {
				this.highlightInvalidsFormGroup(control as FormGroup);
			}
			else if (control instanceof FormArray) {
				this.highlightInvalidsFormArray(control as FormArray);
			}
			else {
				control.markAsDirty();
			}
		});
	}

	/** Checks values of two controls are matched or not */
	public confirmIsMatched(original: string, confirm: string): ValidatorFn {
		return (formGroup: FormGroup): { [key: string]: any } | null => {
			const originalControl = formGroup.controls[original];
			const confirmControl = formGroup.controls[confirm];
			if (originalControl !== undefined && confirmControl !== undefined && originalControl.value !== confirmControl.value) {
				confirmControl.setErrors({ notEquivalent: true });
				return { notEquivalent: true };
			}
			else {
				return null;
			}
		};
	}

	/** Checks value of the control is matched or not with other control */
	public isMatched(other: string): ValidatorFn {
		return (formControl: AbstractControl): { [key: string]: any } | null => {
			const parentControl = formControl.parent;
			if (parentControl instanceof FormGroup) {
				const otherControl = (parentControl as FormGroup).controls[other];
				if (otherControl !== undefined && otherControl.value !== formControl.value) {
					formControl.setErrors({ notEquivalent: true });
					return { notEquivalent: true };
				}
				else {
					return null;
				}
			}
			else {
				return null;
			}
		};
	}

	/** Shows the loading */
	public async showLoadingAsync(message?: string) {
		if (this._loading === undefined) {
			this._loading = await this.loadingController.create({
				content: message || "Loading..."
			});
			await this._loading.present();
		}
	}

	/** Hides the loading */
	public async hideLoadingAsync() {
		if (this._loading !== undefined) {
			await this._loading.dismiss();
			this._loading = undefined;
		}
	}

	/** Get the button for working with action sheet */
	public getActionSheetButton(text: string, icon?: string, handler?: () => void, role?: string) {
		return {
			text: text,
			role: role,
			icon: PlatformUtility.isAppleOS ? undefined : icon,
			handler: handler
		};
	}

	/** Shows the action sheet */
	public async showActionSheetAsync(buttons: Array<{ text: string, role: string, icon: string, handler: () => void }>, backdropDismiss?: boolean) {
		this._actionsheet = await this.actionsheetController.create({
			buttons: buttons,
			backdropDismiss: backdropDismiss
		});
		await Promise.all([
			this.hideLoadingAsync(),
			this._actionsheet.present()
		]);
	}

	/** Hides the action sheet */
	public async hideActionSheetAsync() {
		if (this._actionsheet !== undefined) {
			await this._actionsheet.dismiss();
			this._actionsheet = undefined;
		}
	}

	/** Shows the alert confirmation box  */
	public async showAlertAsync(header: string = null, subHeader: string = null, message: string, postProcess: () => void = () => {}, okButtonText: string = null, cancelButtonText: string = null) {
		const buttons = AppUtility.isNotEmpty(cancelButtonText)
			? [{ text: cancelButtonText, role: "cancel", handler: undefined as () => void }]
			: [];
		buttons.push({ text: okButtonText || "Đóng", role: undefined as string, handler: () => postProcess() });
		const alert = await this.alertController.create({
			header: header || "Chú ý",
			subHeader: subHeader,
			backdropDismiss: false,
			message: message,
			buttons: buttons
		});
		await Promise.all([
			this.hideLoadingAsync(),
			alert.present()
		]);
	}

	/** Shows the error message (by the alert confirmation box) */
	public async showErrorAsync(error: any, subHeader?: string, postProcess?: () => void) {
		await this.showAlertAsync("Lỗi", subHeader, AppUtility.isNotEmpty(error.Message) ? error.Message : "Đã xảy ra lỗi!", postProcess);
	}

}
