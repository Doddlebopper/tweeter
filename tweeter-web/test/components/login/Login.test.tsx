import { MemoryRouter } from 'react-router-dom';
import Login from '../../../src/components/authentication/login/Login';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import "@testing-library/jest-dom";
import { instance, mock, verify } from '@typestrong/ts-mockito';
import { LoginPresenter } from '../../../src/presenter/LoginPresenter';

describe('Login Component', () => {
    it("starts with the sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElement("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign in button if both alias and password fields have text", async () => {
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElement("/");

        await user.type(aliasField, "a");
        await user.type(passwordField, "b");

        expect(signInButton).toBeEnabled();
    });

    it("disables the sign in button if either the alias or the password field is cleared", async () => {
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElement("/");

        await user.type(aliasField, "a");
        await user.type(passwordField, "b");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "a");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("call's the presenter's login method with the correct parameters when the sign in button is clicked", async () => {

        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "http://somewhere.com";
        const alias = "@alias";
        const password = "password";
        


        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);

        verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();


    });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter> 
            {!!presenter ? (<Login presenter={presenter} originalUrl={originalUrl} />) : (<Login originalUrl={originalUrl} />)}
        </MemoryRouter>

    );
}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole('button', { name: /Sign in/i });
    const aliasField = screen.getByLabelText("Alias")
    const passwordField = screen.getByLabelText("Password")

    return { user, signInButton, aliasField, passwordField };

}