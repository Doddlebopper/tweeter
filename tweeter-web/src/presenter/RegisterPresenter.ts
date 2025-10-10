import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { Buffer } from "buffer";

export interface RegisterView {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
    displayErrorMessage: (message: string) => void;
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
    setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter {
    private authenticationService: AuthenticationService;
    private _view: RegisterView;

    public constructor(view: RegisterView) {
        this._view = view;
        this.authenticationService = new AuthenticationService();
    }

    protected get view(): RegisterView {
        return this._view;
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.authenticationService.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate(`/feed/${user.alias}`);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
        } finally {
            this.view.setIsLoading(false);
        }
    }

    public handleImageFile(file: File | undefined): void {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);

            // Set image file extension
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.view.setImageFileExtension(fileExtension);
            }
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    }

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    }
}

