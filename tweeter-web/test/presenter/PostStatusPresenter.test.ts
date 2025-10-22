import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusPresenterView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const currentUser = new User("firstName", "lastName", "alias", "imageUrl");
    const postText = "Test post content";

    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>();
        const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);

        mockService = mock<StatusService>();
        const mockServiceInstance = instance(mockService);

        postStatusPresenter = new PostStatusPresenter(mockPostStatusPresenterViewInstance, mockServiceInstance);
    });

    it("tells the view to display a posting status message", async () => {
        postStatusPresenter.submitPost(postText, currentUser, authToken);
        verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the status service with the correct status and auth token", async () => {
        await postStatusPresenter.submitPost(postText, currentUser, authToken);
        verify(mockService.postStatus(authToken, anything())).once();
    });

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
        await postStatusPresenter.submitPost(postText, currentUser, authToken);

        verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
        verify(mockPostStatusPresenterView.setPost("")).once();
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
    });

    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when posting fails", async () => {
        let error = new Error("Posting failed");
        when(mockService.postStatus(anything(), anything())).thenThrow(error);

        await postStatusPresenter.submitPost(postText, currentUser, authToken);
        //let [errorString] = capture(mockPostStatusPresenterView.displayErrorMessage).last();

        verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
        verify(mockPostStatusPresenterView.displayErrorMessage('failed to post the status because of exception: Posting failed')).once();
        
        verify(mockPostStatusPresenterView.setPost("")).never();
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
    });
});