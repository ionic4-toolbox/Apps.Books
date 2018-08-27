import { Component, OnInit, ViewChild } from "@angular/core";
import { ImageCropperComponent, CropperSettings } from "ng2-img-cropper";
import { TrackingUtility } from "../../components/app.utility.trackings";
import { PlatformUtility } from "../../components/app.utility.platform";
import { AppFormsService } from "../../components/forms.service";
import { ConfigurationService } from "../../providers/configuration.service";
import { UserService } from "../../providers/user.service";
import { FileService } from "../../providers/file.service";
import { UserProfile } from "../../models/user";

@Component({
	selector: "page-account-avatar",
	templateUrl: "./avatar.page.html",
	styleUrls: ["./avatar.page.scss"]
})
export class AccountAvatarPage implements OnInit {

	constructor (
		public appFormsSvc: AppFormsService,
		public configSvc: ConfigurationService,
		public fileSvc: FileService,
		public userSvc: UserService
	) {
	}

	title = "Cập nhật ảnh đại diện";
	profile: UserProfile = undefined;
	mode = "Avatar";
	cropper = {
		settings: new CropperSettings(),
		data: {
			image: "",
			original: undefined
		}
	};
	processing = false;
	@ViewChild("imgcropper") cropperComponent: ImageCropperComponent;

	public ngOnInit() {
		this.profile = this.configSvc.getAccount().profile;
		this.mode = this.profile.Avatar === "" || this.profile.Avatar === this.profile.Gravatar
			? "Gravatar"
			: "Avatar";

		this.cropper.data.image = this.profile.Avatar;
		this.cropper.settings.width = 100;
		this.cropper.settings.height = 100;
		this.cropper.settings.croppedWidth = 300;
		this.cropper.settings.croppedHeight = 300;
		this.cropper.settings.canvasWidth = 242;
		this.cropper.settings.canvasHeight = 242;
		this.cropper.settings.noFileInput = true;
	}

	public prepareImage($event) {
		const image = new Image();
		const fileReader = new FileReader();
		fileReader.onloadend = (loadEvent: any) => {
			image.src = loadEvent.target.result;
			this.cropperComponent.setImage(image);
		};
		fileReader.readAsDataURL($event.target.files[0]);
	}

	private async updateProfileAsync() {
		await this.userSvc.updateProfileAsync(this.profile,
			async () => {
				this.configSvc.getAccount().profile = UserProfile.get(this.profile.ID);
				await this.configSvc.storeProfileAsync(async () => {
					await TrackingUtility.trackAsync(this.title, "account/avatar");
					await this.cancelAsync(async () => this.appFormsSvc.showToastAsync("Ảnh đại diện đã được cập nhật..."));
				});
			},
			async error => {
				this.processing = false;
				PlatformUtility.showError("Error occurred while updating profile with new avatar image", error);
			}
		);
	}

	public async updateAsync() {
		this.processing = true;
		if (this.mode === "Avatar" && this.cropper.data.image !== "" && this.cropper.data.image !== this.profile.Avatar) {
			await this.fileSvc.uploadAvatarAsync(this.cropper.data.image,
				async data => {
					this.profile.Avatar = data.Uri;
					this.cropper.data = {
						image: data.Uri,
						original: undefined
					};
					await this.updateProfileAsync();
				},
				error => {
					PlatformUtility.showError("Error occurred while uploading avatar image", error);
					this.processing = false;
				}
			);
		}
		else if (this.mode === "Gravatar" && this.profile.Avatar !== "") {
			this.profile.Avatar = "";
			await this.updateProfileAsync();
		}
		else {
			await this.cancelAsync();
		}
	}

	public async cancelAsync(onDismiss?: () => void) {
		await this.appFormsSvc.hideModalAsync(onDismiss);
	}

}
