import React from 'react'
import AsideLogo from '../components/AsideLogo';
import AuthForm from '../components/AuthForm';

function TwoFactPage(): JSX.Element {

    return (
        <div id="app">
            <div className="d-flex">
                <AsideLogo />
                <AuthForm page="twoFact" />
            </div>
        </div>
    );
}

export default TwoFactPage;