import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthenticationService } from "../../src/model.service/AuthenticationService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockService: AuthenticationService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
       mockAppNavbarPresenterView = mock<AppNavbarView>();
       const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);
       when(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

       mockService = mock<AuthenticationService>();
       const mockServiceInstance = instance(mockService);

       appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarPresenterViewInstance, mockServiceInstance);
    })

    it("tells the view to display a logging out message", async () => {
        appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    })

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockService.logout(authToken)).once();
    });

    it("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page when successful", async () => {
        await appNavbarPresenter.logOut(authToken);


        verify(mockAppNavbarPresenterView.deleteMessage('messageId123')).once();
        verify(mockAppNavbarPresenterView.clearUserInfo()).once();
        verify(mockAppNavbarPresenterView.navigate("/login")).once();

        verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
    })

    it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page", async () => {
        let error = new Error("An Error Occured");
        when(mockService.logout(anything())).thenThrow(error);

        await appNavbarPresenter.logOut(authToken);
        
        verify(mockAppNavbarPresenterView.displayErrorMessage('failed to log user out because of exception: An Error Occured')).once();

        verify(mockAppNavbarPresenterView.deleteMessage(anything())).never();
        verify(mockAppNavbarPresenterView.clearUserInfo()).never();
        verify(mockAppNavbarPresenterView.navigate("/login")).never();
    })
});
