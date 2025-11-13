import type { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import { Buffer } from "buffer";
import { buildAuthFailureResponse, buildAuthSuccessResponse } from "../common/auth-common/authCommon";

export const handler = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  const authService = new AuthenticationService();

  const {
    firstName,
    lastName,
    alias,
    password,
    imageStringBase64,
    imageFileExtension,
  } = request;

  try {
    const imageBuffer = Buffer.from(imageStringBase64, "base64");
    const userImageBytes = new Uint8Array(
      imageBuffer.buffer,
      imageBuffer.byteOffset,
      imageBuffer.byteLength
    );

    const [user, authToken] = await authService.register(
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    );

    return buildAuthSuccessResponse<RegisterResponse>(user, authToken);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to complete registration.";
    return buildAuthFailureResponse<RegisterResponse>(message);
  }
};
