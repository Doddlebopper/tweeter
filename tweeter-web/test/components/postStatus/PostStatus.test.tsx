import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { userEvent } from '@testing-library/user-event';
import PostStatus from '../../../src/components/postStatus/PostStatus';
import { instance, mock, verify } from '@typestrong/ts-mockito';
import { PostStatusPresenter } from '../../../src/presenter/PostStatusPresenter';
import { User, AuthToken } from 'tweeter-shared';

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

jest.mock("../../../src/presenter/PostStatusPresenter", () => ({
  PostStatusPresenter: jest.fn(),
}));

import { useUserInfo } from '../../../src/components/userInfo/UserInfoHooks';
import { PostStatusPresenter as MockedPostStatusPresenter } from '../../../src/presenter/PostStatusPresenter';
const mockUseUserInfo = useUserInfo as jest.MockedFunction<typeof useUserInfo>;
const MockedPostStatusPresenterClass = MockedPostStatusPresenter as jest.MockedClass<typeof PostStatusPresenter>;

describe('PostStatus Component', () => {
    const mockUser: User = new User("Test", "User", "@testuser", "testimage.png");
    const mockAuthToken: AuthToken = new AuthToken("token", Date.now());

    beforeEach(() => {
        mockUseUserInfo.mockReturnValue({
            currentUser: mockUser,
            authToken: mockAuthToken,
            displayedUser: mockUser
        });
    });

    it('When first rendered the Post Status and Clear buttons are both disabled.', () => {
        const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
        
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it('Both buttons are enabled when the text field has text.', async () => {
        const { user, postStatusButton, clearButton, textArea } = renderPostStatusAndGetElements();
        
        await user.type(textArea, "Hello world!");
        
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it('Both buttons are disabled when the text field is cleared.', async () => {
        const { user, postStatusButton, clearButton, textArea } = renderPostStatusAndGetElements();
        
        await user.type(textArea, "Hello world!");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
        
        await user.clear(textArea);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
        const mockPresenterInstance = mock<PostStatusPresenter>();
        
        MockedPostStatusPresenterClass.mockImplementation(() => instance(mockPresenterInstance));
        
        const postText = "Test post content";
        const { user, postStatusButton, textArea } = renderPostStatusAndGetElements();
        
        await user.type(textArea, postText);
        await user.click(postStatusButton);
        
        verify(mockPresenterInstance.submitPost(postText, mockUser, mockAuthToken)).once();
    });
});

function renderPostStatus() {
    return render(<PostStatus />);
}

function renderPostStatusAndGetElements() {
    const user = userEvent.setup();
    
    renderPostStatus();
    
    const postStatusButton = screen.getByRole('button', { name: /Post Status/i });
    const clearButton = screen.getByRole('button', { name: /Clear/i });
    const textArea = screen.getByRole('textbox');
    
    return { user, postStatusButton, clearButton, textArea };
}