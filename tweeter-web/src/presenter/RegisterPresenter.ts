import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
    setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
    private registerView: RegisterView;

    public constructor(view: RegisterView) {
        super(view);
        this.registerView = view;
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
        await this.performAuthentication(
            () => this.authenticationService.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            ),
            rememberMe
        );
    }

    public handleImageFile(file: File | undefined): void {
        if (file) {
            this.registerView.setImageUrl(URL.createObjectURL(file));

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

                this.registerView.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);

            // Set image file extension
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.registerView.setImageFileExtension(fileExtension);
            }
        } else {
            this.registerView.setImageUrl("");
            this.registerView.setImageBytes(new Uint8Array());
        }
    }

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    }

    protected getOperationDescription(): string {
        return "register user";
    }
}

