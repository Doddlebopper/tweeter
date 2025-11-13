type BaseResponse = {
  success: boolean;
  message: string | null;
};

export const createSuccessResponse = <Payload>(
  payload: Payload,
  message: string | null = null
): Payload & BaseResponse => ({
  ...(payload as Payload),
  success: true,
  message,
});

export const createFailureResponse = <Payload>(
  message: string,
  payload: Payload
): Payload & BaseResponse => ({
  ...(payload as Payload),
  success: false,
  message,
});

